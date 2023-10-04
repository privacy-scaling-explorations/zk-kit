<p align="center">
    <h1 align="center">
         Incremental Merkle Trees (Solidity)
    </h1>
    <p align="center">Incremental Merkle tree implementations in Solidity.</p>
</p>

<p align="center">
    <a href="https://github.com/privacy-scaling-explorations/zk-kit">
        <img src="https://img.shields.io/badge/project-zk--kit-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/zk-kit/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/privacy-scaling-explorations/zk-kit.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@zk-kit/imt.sol">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@zk-kit/imt.sol?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@zk-kit/imt.sol">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@zk-kit/imt.sol.svg?style=flat-square" />
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
        <a href="https://appliedzkp.org/discord">
            🗣️ Chat &amp; Support
        </a>
    </h4>
</div>

## Libraries

✔️ [BinaryIMT](https://github.com/privacy-scaling-explorations/zk-kit/blob/main/packages/imt.sol/contracts/BinaryIMT.sol) (Poseidon)\
✔️ [QuinIMT](https://github.com/privacy-scaling-explorations/zk-kit/blob/main/packages/imt.sol/contracts/QuinIMT.sol) (Poseidon)\
✔️ [LazyIMT](https://github.com/privacy-scaling-explorations/zk-kit/blob/main/packages/imt.sol/contracts/LazyIMT.sol) (Poseidon)

---

## 🛠 Install

### npm or yarn

Install the `@zk-kit/imt.sol` package with npm:

```bash
npm i @zk-kit/imt.sol --save
```

or yarn:

```bash
yarn add @zk-kit/imt.sol
```

## 📜 Usage

### Importing and using the library

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@zk-kit/imt.sol/IncrementalBinaryTree.sol";

contract Example {
    using IncrementalBinaryTree for IncrementalTreeData;

    event TreeCreated(bytes32 id, uint256 depth);
    event LeafInserted(bytes32 indexed treeId, uint256 leaf, uint256 root);
    event LeafUpdated(bytes32 indexed treeId, uint256 leaf, uint256 root);
    event LeafRemoved(bytes32 indexed treeId, uint256 leaf, uint256 root);

    mapping(bytes32 => IncrementalTreeData) public trees;

    function createTree(bytes32 _id, uint256 _depth) external {
        require(trees[_id].depth == 0, "Example: tree already exists");

        trees[_id].init(_depth, 0);

        emit TreeCreated(_id, _depth);
    }

    function insertLeaf(bytes32 _treeId, uint256 _leaf) external {
        require(trees[_treeId].depth != 0, "Example: tree does not exist");

        trees[_treeId].insert(_leaf);

        emit LeafInserted(_treeId, _leaf, trees[_treeId].root);
    }

    function updateLeaf(
        bytes32 _treeId,
        uint256 _leaf,
        uint256 _newLeaf,
        uint256[] calldata _proofSiblings,
        uint8[] calldata _proofPathIndices
    ) external {
        require(trees[_treeId].depth != 0, "Example: tree does not exist");

        trees[_treeId].update(_leaf, _newLeaf, _proofSiblings, _proofPathIndices);

        emit LeafUpdated(_treeId, _newLeaf, trees[_treeId].root);
    }

    function removeLeaf(
        bytes32 _treeId,
        uint256 _leaf,
        uint256[] calldata _proofSiblings,
        uint8[] calldata _proofPathIndices
    ) external {
        require(trees[_treeId].depth != 0, "Example: tree does not exist");

        trees[_treeId].remove(_leaf, _proofSiblings, _proofPathIndices);

        emit LeafRemoved(_treeId, _leaf, trees[_treeId].root);
    }
}

```

### Creating an Hardhat task to deploy the contract

```typescript
import { poseidon_gencontract as poseidonContract } from "circomlibjs"
import { Contract } from "ethers"
import { task, types } from "hardhat/config"

task("deploy:example", "Deploy an Example contract")
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers }): Promise<Contract> => {
        const poseidonT3ABI = poseidonContract.generateABI(2)
        const poseidonT3Bytecode = poseidonContract.createCode(2)

        const [signer] = await ethers.getSigners()

        const PoseidonLibT3Factory = new ethers.ContractFactory(poseidonT3ABI, poseidonT3Bytecode, signer)
        const poseidonT3Lib = await PoseidonLibT3Factory.deploy()

        await poseidonT3Lib.deployed()

        logs && console.log(`PoseidonT3 library has been deployed to: ${poseidonT3Lib.address}`)

        const IncrementalBinaryTreeLibFactory = await ethers.getContractFactory("IncrementalBinaryTree", {
            libraries: {
                PoseidonT3: poseidonT3Lib.address
            }
        })
        const incrementalBinaryTreeLib = await IncrementalBinaryTreeLibFactory.deploy()

        await incrementalBinaryTreeLib.deployed()

        logs && console.log(`IncrementalBinaryTree library has been deployed to: ${incrementalBinaryTreeLib.address}`)

        const ContractFactory = await ethers.getContractFactory("Example", {
            libraries: {
                IncrementalBinaryTree: incrementalBinaryTreeLib.address
            }
        })

        const contract = await ContractFactory.deploy()

        await contract.deployed()

        logs && console.log(`Example contract has been deployed to: ${contract.address}`)

        return contract
    })
```
