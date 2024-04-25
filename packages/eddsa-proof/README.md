<p align="center">
    <h1 align="center">
        Eddsa proof
    </h1>
    <p align="center">A library to generate and verify EdDSA proofs.</p>
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

| This zero-knowledge library allows you to prove and verify that you have the private key of a Semaphore identity. It will be mainly used on-chain because you can get the same result off-chain using EdDSA signatures with the `@semaphore-protocol/identity` package. It facilitates the demonstration of having an EdDSA hash pre-image while keeping the pre-image value confidential. Additionally, it offers a mechanism to prevent the same proof from being reused. The circuit that forms the foundation of this library is accessible via this [link](https://github.com/privacy-scaling-explorations/zk-kit/tree/main/packages/eddsa-proof). |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

The Snark artifacts (`.wasm` and `.zkey` files) can be specified or not in the `generate` function parameters and can possibly be downloaded using the following URLs:

-   https://zkkit.cedoor.dev/eddsa-proof/eddsa-proof.wasm
-   https://zkkit.cedoor.dev/eddsa-proof/eddsa-proof.zkey

> [!WARNING]  
> The Snark artifacts currently used to generate zero-knowledge proofs are the result of an insecure trusted setup, and the library has not yet been audited. Therefore, it is advised not to use it in production.

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

```typescript
import { generate, verify } from "@zk-kit/eddsa-proof"

// Your private key (secret) associated with your commitment.
const privateKey = 1
// A public value used to contextualize the cryptographic proof and calculate the nullifier.
const scope = 2

// Generate the proof.
const fullProof = await generate(privateKey, scope)

/*
    nb. commitment and scope are always the same - proof is variable.
{
    commitment: '5049599877119858813001062015237093339640938925333103011635461484168047396248',
    scope: '2',
    proof: [
        '8187226249860430947135181878676566080058748127595453962723730464659559265736',
        '8666342086907686904498490524943571067960174826127841344605359274053291451578',
        '16951173581335355551706227874569504050650723200983520067525262527574411463239',
        '5330430283785726456850074841877892816784859299864106837646103067998557420540',
        '4275240916243995687770977511669101428890222781102049409716491642577511403456',
        '5254784175927576727963123852365247945765593646193022684829294352292688366957',
        '1691932310118878640744410451232696949890002258184298580387126997072583471834',
        '18016798021948724211946223868702828962374378289486618942397810491195719212700'
    ]
}
*/
console.log(fullProof)

// If not specified, the Snark artifacts are downloaded automatically.
// You can specify them as follows.

// const fullProof = await generate(privateKey, scope, {
//     wasmFilePath: "<your-path>/eddsa-proof.wasm",
//     zkeyFilePath: "<your-path>/eddsa-proof.zkey"
// })

// Verify the proof.
const response = await verify(fullProof)

// true.
console.log(response)
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
