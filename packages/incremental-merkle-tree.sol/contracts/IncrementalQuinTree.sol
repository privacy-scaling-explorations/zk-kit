// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {PoseidonT6} from "./Hashes.sol";

// Each incremental tree has certain properties and data that will
// be used to add new leaves.
struct IncrementalTreeData {
  uint8 depth; // Depth of the tree (levels - 1).
  uint256 root; // Root hash of the tree.
  uint256 numberOfLeaves; // Number of leaves of the tree.
  mapping(uint256 => uint256) zeroes; // Zero hashes used for empty nodes (level -> zero hash).
  // The nodes of the subtrees used in the last addition of a leaf (level -> [nodes]).
  mapping(uint256 => uint256[5]) lastSubtrees; // Caching these values is essential to efficient appends.
}

/// @title Incremental quin Merkle tree.
/// @dev The incremental tree allows to calculate the root hash each time a leaf is added, ensuring
/// the integrity of the tree.
library IncrementalQuinTree {
  uint8 internal constant MAX_DEPTH = 32;
  uint256 internal constant SNARK_SCALAR_FIELD =
    21888242871839275222246405745257275088548364400416034343698204186575808495617;

  /// @dev Initializes a tree.
  /// @param self: Tree data.
  /// @param depth: Depth of the tree.
  /// @param zero: Zero value to be used.
  function init(
    IncrementalTreeData storage self,
    uint8 depth,
    uint256 zero
  ) public {
    require(zero < SNARK_SCALAR_FIELD, "IncrementalBinaryTree: leaf must be < SNARK_SCALAR_FIELD");
    require(depth > 0 && depth <= MAX_DEPTH, "IncrementalQuinTree: tree depth must be between 1 and 32");

    self.depth = depth;

    for (uint8 i = 0; i < depth; i++) {
      self.zeroes[i] = zero;
      uint256[5] memory zeroChildren;

      for (uint8 j = 0; j < 5; j++) {
        zeroChildren[j] = zero;
      }

      zero = PoseidonT6.poseidon(zeroChildren);
    }

    self.root = zero;
  }

  /// @dev Inserts a leaf in the tree.
  /// @param self: Tree data.
  /// @param leaf: Leaf to be inserted.
  function insert(IncrementalTreeData storage self, uint256 leaf) public {
    require(leaf < SNARK_SCALAR_FIELD, "IncrementalQuinTree: leaf must be < SNARK_SCALAR_FIELD");
    require(self.numberOfLeaves < 5**self.depth, "IncrementalQuinTree: tree is full");

    uint256 index = self.numberOfLeaves;
    uint256 hash = leaf;

    for (uint8 i = 0; i < self.depth; i++) {
      uint8 position = uint8(index % 5);

      self.lastSubtrees[i][position] = hash;

      if (position == 0) {
        for (uint8 j = 1; j < 5; j++) {
          self.lastSubtrees[i][j] = self.zeroes[i];
        }
      }

      hash = PoseidonT6.poseidon(self.lastSubtrees[i]);
      index /= 5;
    }

    self.root = hash;
    self.numberOfLeaves += 1;
  }

  /// @dev Removes a leaf from the tree.
  /// @param self: Tree data.
  /// @param leaf: Leaf to be removed.
  /// @param proofSiblings: Array of the sibling nodes of the proof of membership.
  /// @param proofPathIndices: Path of the proof of membership.
  function remove(
    IncrementalTreeData storage self,
    uint256 leaf,
    uint256[4][] calldata proofSiblings,
    uint8[] calldata proofPathIndices
  ) public {
    require(verify(self, leaf, proofSiblings, proofPathIndices), "IncrementalQuinTree: leaf is not part of the tree");

    uint256 hash = self.zeroes[0];

    for (uint8 i = 0; i < self.depth; i++) {
      uint256[5] memory nodes;

      for (uint8 j = 0; j < 5; j++) {
        if (j < proofPathIndices[i]) {
          nodes[j] = proofSiblings[i][j];
        } else if (j == proofPathIndices[i]) {
          nodes[j] = hash;
        } else {
          nodes[j] = proofSiblings[i][j - 1];
        }
      }

      if (nodes[0] == self.lastSubtrees[i][0] || nodes[4] == self.lastSubtrees[i][4]) {
        self.lastSubtrees[i][proofPathIndices[i]] = hash;
      }

      hash = PoseidonT6.poseidon(nodes);
    }

    self.root = hash;
  }

  /// @dev Verify if the path is correct and the leaf is part of the tree.
  /// @param self: Tree data.
  /// @param leaf: Leaf to be removed.
  /// @param proofSiblings: Array of the sibling nodes of the proof of membership.
  /// @param proofPathIndices: Path of the proof of membership.
  /// @return True or false.
  function verify(
    IncrementalTreeData storage self,
    uint256 leaf,
    uint256[4][] calldata proofSiblings,
    uint8[] calldata proofPathIndices
  ) private view returns (bool) {
    require(leaf < SNARK_SCALAR_FIELD, "IncrementalQuinTree: leaf must be < SNARK_SCALAR_FIELD");
    require(
      proofPathIndices.length == self.depth && proofSiblings.length == self.depth,
      "IncrementalQuinTree: length of path is not correct"
    );

    uint256 hash = leaf;

    for (uint8 i = 0; i < self.depth; i++) {
      uint256[5] memory nodes;

      for (uint8 j = 0; j < 5; j++) {
        if (j < proofPathIndices[i]) {
          require(
            proofSiblings[i][j] < SNARK_SCALAR_FIELD,
            "IncrementalQuinTree: sibling node must be < SNARK_SCALAR_FIELD"
          );

          nodes[j] = proofSiblings[i][j];
        } else if (j == proofPathIndices[i]) {
          nodes[j] = hash;
        } else {
          require(
            proofSiblings[i][j - 1] < SNARK_SCALAR_FIELD,
            "IncrementalQuinTree: sibling node must be < SNARK_SCALAR_FIELD"
          );

          nodes[j] = proofSiblings[i][j - 1];
        }
      }

      hash = PoseidonT6.poseidon(nodes);
    }

    return hash == self.root;
  }
}
