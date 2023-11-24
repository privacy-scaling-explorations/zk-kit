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

| This zero-knowledge library facilitates the demonstration of having a Poseidon hash pre-image while keeping the pre-image value confidential. Additionally, it offers a mechanism to prevent the same proof from being reused. The circuit that forms the foundation of this library is accessible via this [link](https://github.com/privacy-scaling-explorations/zk-kit/blob/main/packages/circuits/templates/poseidon-proof.circom). |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

Originally developed for integration with [Semaphore V4](https://github.com/semaphore-protocol/semaphore), this library also functions effectively as a standalone tool. Notable use cases in connection with Semaphore can be:

* allowing a Semaphore user to prove that they possess the secret value associated with the identity commitment of their Semaphore identity,
* unmasking the identity of zero-knowledge proofs earlier created using Semaphore.

The Snark artifacts (`.wasm` and `.zkey` files) can be specified or not in the `generate` function parameters and can possibly be downloaded using the following URLs:

https://github.com/privacy-scaling-explorations/zk-kit/blob/ee457299d36d2601e5bf520237977a9f16b1b599/packages/poseidon-proof/src/config.ts#L5-L8

> [!WARNING]  
> The Snark artifacts currently used to generate zero-knowledge proofs are the result of an unsecure trusted setup, and the library has not yet been audited. Therefore, it is advised not to use it in production.

## 📈 Benchmarks

Benchmarks were run on an Intel Core i7-1165G7, 16 GB RAM machine, after initializing the BN128 curve with [`@zk-kit/groth16`](https://github.com/privacy-scaling-explorations/zk-kit/edit/main/packages/groth16)-`buildBn128` (~230ms).

| Generate proof | Verify proof | Constraints |
| -------------- | ------------ | ----------- |
| `80ms`         | `10ms`       | `141`       |

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

console.log(fullProof)
/*
{
    scope: '1',
    hash: '8645981980787649023086883978738420856660271013038108762834452721572614684349',
    nullifier: '7853200120776062878684798364095072458815029376092732009249414926327459813530',
    proof: [
        '8439157877715136449451128027974582198942685548176158240742469858289217640295',
        '7742778415084033741154475792823260193410560424636243716622958831215275441500',
        '19005176609208302398813682947612978224483117018101271134113308439452561466691',
        '6209272538382784759793219866517186573065390524051102537220446165983489601194',
        '12222537243697573476419214640884921904066033266502734603198915705889607365883',
        '20066191345466355816238393590466176790809335456890624395337970890893401456064',
        '4851746896803117511000878727783002155680855098198108089136166702412365578625',
        '18391775232946751568173446051923718267369779168471637305003186214102154164036'
    ]
}
*/
```

\# **verify**(poseidonProof: _PoseidonProof_): Promise\<_boolean_>

```typescript
import { verify } from "@zk-key/poseidon-proof"

const response = await verifyProof(fullProof)

console.log(response) // true or false

// Eventually you may want to check the nullifier.
```
