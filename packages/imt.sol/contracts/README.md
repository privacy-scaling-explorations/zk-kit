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
    <a href="https://github.com/privacy-scaling-explorations/zk-kit/tree/main/packages/imt.sol/contracts/LICENSE">
        <img alt="NPM license" src="https://img.shields.io/npm/l/%40zk-kit%2Fimt.sol?style=flat-square">
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

> [!WARNING]  
> If you are looking for the first version of this package, please visit this [link](https://github.com/privacy-scaling-explorations/zk-kit/tree/imt-v1/packages/incremental-merkle-tree.sol).

> [!WARNING]  
> These libraries have **not** been audited.

## Libraries

✔️ [BinaryIMT](https://github.com/privacy-scaling-explorations/zk-kit/blob/main/packages/imt.sol/contracts/internal/InternalBinaryIMT.sol) (Poseidon)\
✔️ [QuinaryIMT](https://github.com/privacy-scaling-explorations/zk-kit/blob/main/packages/imt.sol/contracts/internal/InternalQuinaryIMT.sol) (Poseidon)\
✔️ [LazyIMT](https://github.com/privacy-scaling-explorations/zk-kit/blob/main/packages/imt.sol/contracts/internal/InternalLazyIMT.sol) (Poseidon)\
✔️ [LeanIMT](https://github.com/privacy-scaling-explorations/zk-kit/blob/main/packages/imt.sol/contracts/internal/InternalLeanIMT.sol) (Poseidon) ([Visual explanation](https://hackmd.io/@vplasencia/S1whLBN16))

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

Please, see the [test contracts](./test) for guidance on utilizing the libraries.
