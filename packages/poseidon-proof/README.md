<p align="center">
    <h1 align="center">
        Poseidon proof
    </h1>
    <p align="center">A library to generate and verify Poseidon proofs.</p>
</p>

<p align="center">
    <a href="https://github.com/privacy-scaling-explorations/zk-kit">
        <img src="https://img.shields.io/badge/project-zk--kit-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/zk-kit/tree/main/packages/poseidon-proof/LICENSE">
        <img alt="NPM license" src="https://img.shields.io/npm/l/%40zk-kit%2Fposeidon-proof?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@zk-kit/poseidon-proof">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@zk-kit/poseidon-proof?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@zk-kit/poseidon-proof">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@zk-kit/poseidon-proof.svg?style=flat-square" />
    </a>
    <a href="https://bundlephobia.com/package/@zk-kit/poseidon-proof">
        <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/@zk-kit/poseidon-proof" />
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
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://zkkit.pse.dev/modules/_zk_kit_poseidon_proof.html">
            📘 Docs
        </a>
    </h4>
</div>

## 🛠 Install

### npm or yarn

Install the `@zk-kit/poseidon-proof` package:

```bash
npm i @zk-kit/poseidon-proof
```

or yarn:

```bash
yarn add @zk-kit/poseidon-proof
```

## 📜 Usage

\# **generate**(
message: _BigNumberish_,
scope: _BigNumberish_,
snarkArtifacts?: _SnarkArtifacts_
): Promise\<_PoseidonProof_>

```typescript
import { generate } from "@zk-kit/poseidon-proof"

const scope = 1
const message = 2

const fullProof = await generate(message, scope)

// If not specified, the Snark artifacts are downloaded automatically.
// You can also specify them.
const fullProof = await generate(message, scope, {
    zkeyFilePath: "./poseidon-proof.zkey",
    wasmFilePath: "./poseidon-proof.wasm"
})
```

\# **verify**(poseidonProof: _PoseidonProof_): Promise\<_boolean_>

```typescript
import { verify } from "@zk-key/poseidon-proof"

await verifyProof(fullProof)
```
