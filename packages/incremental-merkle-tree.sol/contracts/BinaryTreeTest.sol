// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "./IncrementalBinaryTree.sol";

contract BinaryTreeTest {
  using IncrementalBinaryTree for IncrementalTreeData;

  event TreeCreated(bytes32 id, uint8 depth);
  event LeafInserted(bytes32 indexed treeId, uint256 leaf, uint256 root);
  event LeafRemoved(bytes32 indexed treeId, uint256 leaf, uint256 root);

  mapping(bytes32 => IncrementalTreeData) public trees;

  function createTree(bytes32 _id, uint8 _depth) external {
    require(trees[_id].depth == 0, "BinaryTreeTest: tree already exists");

    trees[_id].init(_depth, 0);

    emit TreeCreated(_id, _depth);
  }

  function insertLeaf(bytes32 _treeId, uint256 _leaf) external {
    require(trees[_treeId].depth != 0, "BinaryTreeTest: tree does not exist");

    trees[_treeId].insert(_leaf);

    emit LeafInserted(_treeId, _leaf, trees[_treeId].root);
  }

  function removeLeaf(
    bytes32 _treeId,
    uint256 _leaf,
    uint256[] calldata _proofSiblings,
    uint8[] calldata _proofPathIndices
  ) external {
    require(trees[_treeId].depth != 0, "BinaryTreeTest: tree does not exist");

    trees[_treeId].remove(_leaf, _proofSiblings, _proofPathIndices);

    emit LeafRemoved(_treeId, _leaf, trees[_treeId].root);
  }
}
