// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {PoseidonT6} from "poseidon-solidity/PoseidonT6.sol";

// Each incremental tree has certain properties and data that will
// be used to add new leaves.
struct QuinaryIMTData {
    uint256 depth; // Depth of the tree (levels - 1).
    uint256 root; // Root hash of the tree.
    uint256 numberOfLeaves; // Number of leaves of the tree.
    mapping(uint256 => uint256) zeroes; // Zero hashes used for empty nodes (level -> zero hash).
    // The nodes of the subtrees used in the last addition of a leaf (level -> [nodes]).
    mapping(uint256 => uint256[5]) lastSubtrees; // Caching these values is essential to efficient appends.
}

/// @title Incremental quinary Merkle tree.
/// @dev The incremental tree allows to calculate the root hash each time a leaf is added, ensuring
/// the integrity of the tree.
library QuinaryIMT {
    uint8 public constant MAX_DEPTH = 32;
    uint256 public constant SNARK_SCALAR_FIELD =
        21888242871839275222246405745257275088548364400416034343698204186575808495617;

    /// @dev Initializes a tree.
    /// @param self: Tree data.
    /// @param depth: Depth of the tree.
    /// @param zero: Zero value to be used.
    function init(
        QuinaryIMTData storage self,
        uint256 depth,
        uint256 zero
    ) public {
        require(zero < SNARK_SCALAR_FIELD, "QuinaryIMT: leaf must be < SNARK_SCALAR_FIELD");
        require(depth > 0 && depth <= MAX_DEPTH, "QuinaryIMT: tree depth must be between 1 and 32");

        self.depth = depth;

        for (uint8 i = 0; i < depth; ) {
            self.zeroes[i] = zero;
            uint256[5] memory zeroChildren;

            for (uint8 j = 0; j < 5; ) {
                zeroChildren[j] = zero;
                unchecked {
                    ++j;
                }
            }

            zero = PoseidonT6.hash(zeroChildren);

            unchecked {
                ++i;
            }
        }

        self.root = zero;
    }

    /// @dev Inserts a leaf in the tree.
    /// @param self: Tree data.
    /// @param leaf: Leaf to be inserted.
    function insert(QuinaryIMTData storage self, uint256 leaf) public {
        uint256 depth = self.depth;

        require(leaf < SNARK_SCALAR_FIELD, "QuinaryIMT: leaf must be < SNARK_SCALAR_FIELD");
        require(self.numberOfLeaves < 5**depth, "QuinaryIMT: tree is full");

        uint256 index = self.numberOfLeaves;
        uint256 hash = leaf;

        for (uint8 i = 0; i < depth; ) {
            uint8 position = uint8(index % 5);

            self.lastSubtrees[i][position] = hash;

            if (position == 0) {
                for (uint8 j = 1; j < 5; ) {
                    self.lastSubtrees[i][j] = self.zeroes[i];
                    unchecked {
                        ++j;
                    }
                }
            }

            hash = PoseidonT6.hash(self.lastSubtrees[i]);
            index /= 5;

            unchecked {
                ++i;
            }
        }

        self.root = hash;
        self.numberOfLeaves += 1;
    }

    /// @dev Updates a leaf in the tree.
    /// @param self: Tree data.
    /// @param leaf: Leaf to be updated.
    /// @param newLeaf: New leaf.
    /// @param proofSiblings: Array of the sibling nodes of the proof of membership.
    /// @param proofPathIndices: Path of the proof of membership.
    function update(
        QuinaryIMTData storage self,
        uint256 leaf,
        uint256 newLeaf,
        uint256[4][] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) public {
        require(newLeaf != leaf, "QuinaryIMT: new leaf cannot be the same as the old one");
        require(newLeaf < SNARK_SCALAR_FIELD, "QuinaryIMT: new leaf must be < SNARK_SCALAR_FIELD");
        require(verify(self, leaf, proofSiblings, proofPathIndices), "QuinaryIMT: leaf is not part of the tree");

        uint256 depth = self.depth;
        uint256 hash = newLeaf;
        uint256 updateIndex;

        for (uint8 i = 0; i < depth; ) {
            uint256[5] memory nodes;
            updateIndex += proofPathIndices[i] * 5**i;

            for (uint8 j = 0; j < 5; ) {
                if (j < proofPathIndices[i]) {
                    nodes[j] = proofSiblings[i][j];
                } else if (j == proofPathIndices[i]) {
                    nodes[j] = hash;
                } else {
                    nodes[j] = proofSiblings[i][j - 1];
                }
                unchecked {
                    ++j;
                }
            }

            if (nodes[0] == self.lastSubtrees[i][0] || nodes[4] == self.lastSubtrees[i][4]) {
                self.lastSubtrees[i][proofPathIndices[i]] = hash;
            }

            hash = PoseidonT6.hash(nodes);

            unchecked {
                ++i;
            }
        }
        require(updateIndex < self.numberOfLeaves, "QuinaryIMT: leaf index out of range");

        self.root = hash;
    }

    /// @dev Removes a leaf from the tree.
    /// @param self: Tree data.
    /// @param leaf: Leaf to be removed.
    /// @param proofSiblings: Array of the sibling nodes of the proof of membership.
    /// @param proofPathIndices: Path of the proof of membership.
    function remove(
        QuinaryIMTData storage self,
        uint256 leaf,
        uint256[4][] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) public {
        update(self, leaf, self.zeroes[0], proofSiblings, proofPathIndices);
    }

    /// @dev Verify if the path is correct and the leaf is part of the tree.
    /// @param self: Tree data.
    /// @param leaf: Leaf to be removed.
    /// @param proofSiblings: Array of the sibling nodes of the proof of membership.
    /// @param proofPathIndices: Path of the proof of membership.
    /// @return True or false.
    function verify(
        QuinaryIMTData storage self,
        uint256 leaf,
        uint256[4][] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) private view returns (bool) {
        require(leaf < SNARK_SCALAR_FIELD, "QuinaryIMT: leaf must be < SNARK_SCALAR_FIELD");
        uint256 depth = self.depth;
        require(
            proofPathIndices.length == depth && proofSiblings.length == depth,
            "QuinaryIMT: length of path is not correct"
        );

        uint256 hash = leaf;

        for (uint8 i = 0; i < depth; ) {
            uint256[5] memory nodes;

            require(proofPathIndices[i] >= 0 && proofPathIndices[i] < 5, "QuinaryIMT: path index is not between 0 and 4");

            for (uint8 j = 0; j < 5; ) {
                if (j < proofPathIndices[i]) {
                    require(
                        proofSiblings[i][j] < SNARK_SCALAR_FIELD,
                        "QuinaryIMT: sibling node must be < SNARK_SCALAR_FIELD"
                    );

                    nodes[j] = proofSiblings[i][j];
                } else if (j == proofPathIndices[i]) {
                    nodes[j] = hash;
                } else {
                    require(
                        proofSiblings[i][j - 1] < SNARK_SCALAR_FIELD,
                        "QuinaryIMT: sibling node must be < SNARK_SCALAR_FIELD"
                    );

                    nodes[j] = proofSiblings[i][j - 1];
                }

                unchecked {
                    ++j;
                }
            }

            hash = PoseidonT6.hash(nodes);

            unchecked {
                ++i;
            }
        }

        return hash == self.root;
    }
}
