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
✔️ [QuinaryIMT](https://github.com/privacy-scaling-explorations/zk-kit/blob/main/packages/imt.sol/contracts/QuinaryIMT.sol) (Poseidon)\
✔️ [LazyIMT](https://github.com/privacy-scaling-explorations/zk-kit/blob/main/packages/imt.sol/contracts/LazyIMT.sol) (Poseidon)\
✔️ [LeanIMT](https://github.com/privacy-scaling-explorations/zk-kit/blob/main/packages/imt.sol/contracts/LeanIMT.sol) (Poseidon)

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

import "@zk-kit/imt.sol/BinaryIMT.sol";

contract Example {
    BinaryIMTData public data;

    function init(uint256 depth) external {
        BinaryIMT.init(data, depth, 0);
    }

    function initWithDefaultZeroes(uint256 depth) external {
        BinaryIMT.initWithDefaultZeroes(data, depth);
    }

    function insert(uint256 leaf) external {
        BinaryIMT.insert(data, leaf);
    }

    function update(
        uint256 leaf,
        uint256 newLeaf,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) external {
        BinaryIMT.update(data, leaf, newLeaf, proofSiblings, proofPathIndices);
    }

    function remove(uint256 leaf, uint256[] calldata proofSiblings, uint8[] calldata proofPathIndices) external {
        BinaryIMT.remove(data, leaf, proofSiblings, proofPathIndices);
    }
}
```
