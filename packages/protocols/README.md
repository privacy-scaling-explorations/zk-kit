<p align="center">
    <h1 align="center">
        ZK protocols
    </h1>
    <p align="center">Client library for generating and verifying Semaphore & RLN ZK proofs.</p>
</p>

<p align="center">
    <a href="https://github.com/appliedzkp/zk-kit">
        <img src="https://img.shields.io/badge/project-zk--kit-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/appliedzkp/zk-kit/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/appliedzkp/zk-kit.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@zk-kit/protocols">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@zk-kit/protocols?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@zk-kit/protocols">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@zk-kit/protocols.svg?style=flat-square" />
    </a>
    <a href="https://bundlephobia.com/package/@zk-kit/protocols">
        <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/@zk-kit/protocols" />
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
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://appliedzkp.github.io/zk-kit/protocols">
            📘 Docs
        </a>
    </h4>
</div>

---

## 🛠 Install

### npm or yarn

Install the `@zk-kit/protocols` package with npm:

```bash
npm i @zk-kit/protocols
```

or yarn:

```bash
yarn add @zk-kit/protocols
```

## 📜 Usage

### Generating Merkle proofs

```typescript
import { ZkIdentity } from "@zk-kit/identity"
import { generateMerkleProof } from "@zk-kit/protocols"

const depth = 20
const zeroValue= BigInt(0)
const arity = 5
const identityCommitments = [...];
const identity = new ZkIdentity();
const identityCommitment = identity.genIdentityCommitment();

const merkleProof = generateMerkleProof(depth, zeroValue, arity, identityCommitments, identityCommitment);
```

### Creating Semaphore proofs

```typescript
import { Semaphore, genExternalNullifier } from "@zk-kit/protocols"

const signal = "0x111"
const externalNullifier = genExternalNullifier("voting_1")
const witness = Semaphore.genWitness(identity, merkleProof, externalNullifier, signal)

const fullProof = await Semaphore.genProof(witness, "./semaphore.wasm", "./semaphore.zkey")
```
