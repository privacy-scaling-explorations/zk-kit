<p align="center">
    <h1 align="center">
        ZK-kit circuits
    </h1>
    <p align="center">A comprehensive library of general-purpose zero-knowledge circuits.</p>
</p>

<p align="center">
    <a href="https://github.com/privacy-scaling-explorations/zk-kit">
        <img src="https://img.shields.io/badge/project-zk--kit-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/zk-kit/tree/main/packages/circuits/LICENSE">
        <img alt="NPM license" src="https://img.shields.io/npm/l/%40zk-kit%2Fcircuits?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@zk-kit/circuits">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@zk-kit/circuits?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@zk-kit/circuits">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@zk-kit/circuits.svg?style=flat-square" />
    </a>
</p>

<div align="center">
    <h4>
        <a href="https://appliedzkp.org/discord">
            🗣️ Chat &amp; Support
        </a>
    </h4>
</div>

| This package offers a collection of reusable circuits designed for integration into other projects or protocols, promoting code modularization within the zero-knowledge ecosystem. |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

> [!IMPORTANT]  
> Installation of [Circom](https://docs.circom.io/getting-started/installation/) and [Nargo](https://noir-lang.org/getting_started/nargo_installation) required for circuit tests.

## Circuits

-   Circom:
    -   [PoseidonProof](./circom/poseidon-proof.circom): It proves the possession of a Poseidon pre-image without revealing the pre-image itself.
    -   [BinaryMerkleRoot](./circom/binary-merkle-root.circom): It calculates the root of a binary Merkle tree using a provided proof-of-membership.
-   Noir:
    -   [Sparse Merkle Tree PoseidonBN254](./noir/crates/smt_bn254/src/lib.nr): A reusable library of functions related to Sparse Merkle Trees based on the JS implementation of [@zk-kit/smt](../smt). The library uses the Poseidon hash to implement the following functions:
        -   verifying membership and non-membership proofs
        -   adding a new entry to a SMT
        -   updating an entry of an SMT
        -   deleting an existing entry from an SMT

## 🛠 Install

### Using NPM or Yarn (Circom circuits)

Install the `@zk-kit/circuits` package with npm:

```bash
npm i @zk-kit/circuits --save
```

or yarn:

```bash
yarn add @zk-kit/circuits
```

### Using Nargo (Noir circuits)

In your Nargo.toml file, add the following dependency:

```toml
[dependencies]
smt_bn254 = { tag = "v0.1.0", git = "https://github.com/privacy-scaling-explorations/zk-kit/packages/circuits/noir", directory="crates/smt_bn254" }
```
