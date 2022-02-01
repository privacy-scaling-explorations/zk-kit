<p align="center">
    <h1 align="center">
         Incremental Merkle Trees (Solidity)
    </h1>
    <p align="center">Incremental Merkle tree smart contracts.</p>
</p>

<p align="center">
    <a href="https://github.com/appliedzkp/zk-kit">
        <img src="https://img.shields.io/badge/project-zk--kit-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/appliedzkp/zk-kit/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/appliedzkp/zk-kit.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@zk-kit/incremental-merkle-tree.sol">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@zk-kit/incremental-merkle-tree.sol?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@zk-kit/incremental-merkle-tree.sol">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@zk-kit/incremental-merkle-tree.sol.svg?style=flat-square" />
    </a>
    <a href="https://bundlephobia.com/package/@zk-kit/incremental-merkle-tree.sol">
        <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/@zk-kit/incremental-merkle-tree.sol" />
    </a>
    <a href="https://eslint.org/">
        <img alt="Linter eslint" src="https://img.shields.io/badge/linter-eslint-8080f2?style=flat-square&logo=eslint" />
    </a>
    <a href="https://prettier.io/">
        <img alt="Code style prettier" src="https://img.shields.io/badge/code%20style-prettier-f8bc45?style=flat-square&logo=prettier" />
    </a>
</p>

<div align="center">
    <h4>
        <a href="https://discord.gg/9B9WgGP6YM">
            🗣️ Chat &amp; Support
        </a>
    </h4>
</div>

---

## 🛠 Install

### npm or yarn

Install the `@zk-kit/incremental-merkle-tree.sol` package with npm:

```bash
npm i @zk-kit/incremental-merkle-tree.sol --save
```

or yarn:

```bash
yarn add @zk-kit/incremental-merkle-tree.sol
```

## 📜 Usage

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@zk-kit/incremental-merkle-tree.sol/contracts/IncrementalBinaryTree.sol";

contract Test {
    using IncrementalBinaryTree for IncrementalTreeData;

    event TreeCreated(bytes32 id, uint8 depth);
    event LeafInserted(bytes32 indexed treeId, uint256 leaf, uint256 root);
    event LeafRemoved(bytes32 indexed treeId, uint256 leaf, uint256 root);

    mapping(bytes32 => IncrementalTreeData) public trees;

    function createTree(bytes32 _id, uint8 _depth) external {
        require(trees[_id].depth == 0, "Test: tree already exists");

        trees[_id].init(_depth, 0);

        emit TreeCreated(_id, _depth);
    }

    function insertLeaf(bytes32 _treeId, uint256 _leaf) external {
        require(trees[_treeId].depth != 0, "Test: tree does not exist");

        trees[_treeId].insert(_leaf);

        emit LeafInserted(_treeId, _leaf, trees[_treeId].root);
    }

    function removeLeaf(
        bytes32 _treeId,
        uint256 _leaf,
        uint256[] memory _proofSiblings,
        uint8[] memory _proofPathIndices
    ) external {
        require(trees[_treeId].depth != 0, "Test: tree does not exist");

        trees[_treeId].remove(_leaf, _proofSiblings, _proofPathIndices);

        emit LeafRemoved(_treeId, _leaf, trees[_treeId].root);
    }
}
```

## Contacts

### Developers

- e-mail : me@cedoor.dev
- github : [@cedoor](https://github.com/cedoor)
- website : https://cedoor.dev
