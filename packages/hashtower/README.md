<p align="center">
    <h1 align="center">
        HashTower
    </h1>
    <p align="center">HashTower implementation in TypeScript.</p>
</p>

<p align="center">
    <a href="https://github.com/privacy-scaling-explorations/zk-kit">
        <img src="https://img.shields.io/badge/project-zk--kit-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/zk-kit/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/privacy-scaling-explorations/zk-kit.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@zk-kit/hashtower">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@zk-kit/hashtower?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@zk-kit/hashtower">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@zk-kit/hashtower.svg?style=flat-square" />
    </a>
    <a href="https://bundlephobia.com/package/@zk-kit/hashtower">
        <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/@zk-kit/hashtower" />
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
        <a href="https://zkkit.appliedzkp.org/hashtower">
            📘 Docs
        </a>
    </h4>
</div>

---

## 🛠 Install

### npm or yarn

Install the `@zk-kit/hashtower` package with npm:

```bash
npm i @zk-kit/hashtower --save
```

or yarn:

```bash
yarn add @zk-kit/hashtower
```

### CDN

You can also load it using a `script` tag using [unpkg](https://unpkg.com/):

```html
<script src="https://unpkg.com/@zk-kit/hashtower/"></script>
```

or [JSDelivr](https://www.jsdelivr.com/):

```html
<script src="https://cdn.jsdelivr.net/npm/@zk-kit/hashtower/"></script>
```

## 📜 Usage

```typescript
import { HashTowerHashChainProofBuilder } from "@zk-kit/hashtower"
import { poseidon } from "circomlibjs" // v0.0.8

const H = 10
const W = 4
const pb = HashTowerHashChainProofBuilder(H, W, poseidon)
for (let i = BigInt(0); i < 150; i += BigInt(1)) {
    pb.add(i)
}
const index = pb.indexOf(BigInt(42))
const proof = pb.build(index)
console.log(proof)
```

## Contacts

### Developers

-   e-mail : lcamel@gmail.com
-   github : [@LCamel](https://github.com/LCamel)
-   website : https://twitter.com/LCamel
