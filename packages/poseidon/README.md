<p align="center">
    <h1 align="center">
        Baby Jubjub
    </h1>
    <p align="center">A JavaScript Poseidon implementation over alt_bn128 (aka BN254).</p>
</p>

<p align="center">
    <a href="https://github.com/privacy-scaling-explorations/zk-kit">
        <img src="https://img.shields.io/badge/project-zk--kit-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/zk-kit/tree/main/packages/poseidon/LICENSE">
        <img alt="NPM license" src="https://img.shields.io/npm/l/%40zk-kit%2Fposeidon?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@zk-kit/poseidon">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@zk-kit/poseidon?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@zk-kit/poseidon">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@zk-kit/poseidon.svg?style=flat-square" />
    </a>
    <a href="https://bundlephobia.com/package/@zk-kit/poseidon">
        <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/@zk-kit/poseidon" />
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
        <a href="https://zkkit.pse.dev/modules/_zk_kit_poseidon.html">
            📘 Docs
        </a>
    </h4>
</div>

Poseidon is a ZK-friendly cryptographic hash function designed for efficiency and security. The constants and the other parameters are the same as those used in the Poseidon implementation of [`circomlibjs`](https://github.com/iden3/circomlibjs).

> [!NOTE]  
> This library depends on the [`@noble/curves`](https://github.com/paulmillr/noble-curves)'s audited Poseidon library.

## References

1. Poseidon Website: https://www.poseidon-hash.info.
2. Lorenzo Grassi1, Dmitry Khovratovich2, Christian Rechberger3, Arnab Roy4, and Markus Schofnegger. OSEIDON: A New Hash Function for Zero-Knowledge Proof Systems (Updated Version). https://eprint.iacr.org/2019/458.pdf.
3. Barry WhiteHat, Marta Bellés, Jordi Baylina. _ERC-2494: Baby Jubjub Elliptic Curve_. 2020-01-29. https://eips.ethereum.org/EIPS/eip-2494.

---

## 🛠 Install

### npm or yarn

Install the `@zk-kit/poseidon` package and its peer dependencies with npm:

```bash
npm i @zk-kit/poseidon
```

or yarn:

```bash
yarn add @zk-kit/poseidon
```

### CDN

You can also load it using a `script` tag using [unpkg](https://unpkg.com/):

```html
<script src="https://unpkg.com/@zk-kit/poseidon"></script>
```

or [JSDelivr](https://www.jsdelivr.com/):

```html
<script src="https://cdn.jsdelivr.net/npm/@zk-kit/poseidon"></script>
```

## 📜 Usage

```typescript
import { poseidon, poseidon1, poseidon2 } from "@zk-kit/poseidon"

poseidon([1n, 2n])
// Or:
poseidon2([1n, 2n])
```

This library also supports conditional exports:

```typescript
import poseidon2 from "@zk-kit/poseidon/2"

poseidon2([1n, 2n])
```
