<p align="center">
    <h1 align="center">
        Eddsa proof
    </h1>
    <p align="center">A library to generate and verify Eddsa proofs.</p>
</p>

<p align="center">
    <a href="https://github.com/privacy-scaling-explorations/zk-kit">
        <img src="https://img.shields.io/badge/project-zk--kit-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/zk-kit/tree/main/packages/eddsa-proof/LICENSE">
        <img alt="NPM license" src="https://img.shields.io/npm/l/%40zk-kit%eddsa-proof?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@zk-kit/eddsa-proof">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@zk-kit/eddsa-proof?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@zk-kit/eddsa-proof">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@zk-kit/eddsa-proof.svg?style=flat-square" />
    </a>
    <a href="https://bundlephobia.com/package/@zk-kit/eddsa-proof">
        <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/@zk-kit/eddsa-proof" />
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
        <a href="https://zkkit.pse.dev/modules/_zk_kit_eddsa_proof.html">
            📘 Docs
        </a>
    </h4>
</div>

| This zero-knowledge library allows you to prove and verify that you have the private key of a Semaphore identity. It will be mainly used on-chain because you can get the same result off-chain using eddsa signatures with the `@semaphore-protocol/identity` package. It facilitates the demonstration of having an Eddsa hash pre-image while keeping the pre-image value confidential. Additionally, it offers a mechanism to prevent the same proof from being reused. The circuit that forms the foundation of this library is accessible via this [link](https://github.com/privacy-scaling-explorations/zk-kit/blob/main/packages/circuits/templates/eddsa-proof.circom). |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

The Snark artifacts (`.wasm` and `.zkey` files) can be specified or not in the `generate` function parameters and can possibly be downloaded using the following URLs:

https://github.com/privacy-scaling-explorations/zk-kit/blob/feat/eddsa-proof-package/packages/eddsa-proof/src/config.ts#L3-L4

> [!WARNING]  
> The Snark artifacts currently used to generate zero-knowledge proofs are the result of an unsecure trusted setup, and the library has not yet been audited. Therefore, it is advised not to use it in production.

## 🛠 Install

### npm or yarn

Install the `@zk-kit/eddsa-proof` package:

```bash
npm i @zk-kit/eddsa-proof
```

or yarn:

```bash
yarn add @zk-kit/eddsa-proof
```

## 📜 Usage

\# **generate**(
privateKey: _BigNumberish_,
scope: _BigNumberish_,
snarkArtifacts?: _SnarkArtifacts_
): Promise\<_EddsaProof_>

```typescript
import { generate } from "@zk-kit/eddsa-proof"

const privateKey = 1
const scope = 2
const fullProof = await generate(privateKey, scope)

// If not specified, the Snark artifacts are downloaded automatically.
// You can also specify them.
const fullProof2 = await generate(privateKey, scope, {
    wasmFilePath: "./eddsa-proof.wasm",
    zkeyFilePath: "./eddsa-proof.zkey"
})

console.log(fullProof)
/*
{
  commitment: '5049599877119858813001062015237093339640938925333103011635461484168047396248',
  nullifier: '17497379639943633851346493228367413150507773453659752893900470911568040697361',
  scope: '2',
  proof: [
    '18392800611302820475709697133252739806342575574192735504627107618084955849494',
    '3139664437198069480746011261656760712154432507964807119387874466754122504319',
    '2926005573702221084470344496544073174366165223790843322464223933649959929270',
    '4132619827950535279366448851565052919975107704790735230484508843232670051733',
    '10399610458125638051700926970646895498080212222006163309808145895168057525016',
    '14223932204982209069301127930516562499195715516743071645386272252629709681389',
    '2000379565800902394584627975194425737486259798384645466563458664443092083577',
    '18522933983552852064046476861145098090199303002967300855459348911236791388680'
  ]
}
*/
```

\# **verify**(eddsaProof: _EddsaProof_): Promise\<_boolean_>

```typescript
import { verify } from "@zk-kit/eddsa-proof"

const response = await verify(fullProof)

console.log(response) // true or false

// Eventually you may want to check the nullifier.
```

## 📈 Benchmarks

Benchmarks were run on a MacBook Pro, Apple M2 Pro, 16 GB RAM machine, after initializing the BN128 curve with [`@zk-kit/groth16`](https://github.com/privacy-scaling-explorations/zk-kit/edit/main/packages/groth16)-`buildBn128` (~230ms).

| Generate proof | Verify proof | Constraints |
| -------------- | ------------ | ----------- |
| `528.91 ms`    | `10. 997ms`  | `1017`      |

```ts
import { generate, verify } from "@zk-kit/eddsa-proof"
import { buildBn128 } from "@zk-kit/groth16"

await buildBn128()

console.time("generate")

const proof = await generate(1, 2)

console.timeEnd("generate")

console.time("verify")

console.log(await verify(proof))

console.timeEnd("verify")
```
