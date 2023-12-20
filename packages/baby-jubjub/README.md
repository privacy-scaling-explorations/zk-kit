<p align="center">
    <h1 align="center">
        Baby Jubjub
    </h1>
    <p align="center">A JavaScript library for adding points to the <a href="https://eips.ethereum.org/EIPS/eip-2494">Baby Jubjub</a> curve.</p>
</p>

<p align="center">
    <a href="https://github.com/privacy-scaling-explorations/zk-kit">
        <img src="https://img.shields.io/badge/project-zk--kit-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/zk-kit/tree/main/packages/baby-jubjub/LICENSE">
        <img alt="NPM license" src="https://img.shields.io/npm/l/%40zk-kit%2Fbaby-jubjub?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@zk-kit/baby-jubjub">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@zk-kit/baby-jubjub?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@zk-kit/baby-jubjub">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@zk-kit/baby-jubjub.svg?style=flat-square" />
    </a>
    <a href="https://bundlephobia.com/package/@zk-kit/baby-jubjub">
        <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/@zk-kit/baby-jubjub" />
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
        <a href="https://zkkit.pse.dev/modules/_zk_kit_baby_jubjub.html">
            📘 Docs
        </a>
    </h4>
</div>

> [!WARNING]  
> This library has **not** been audited.

## 🛠 Install

### npm or yarn

Install the `@zk-kit/baby-jubjub` package and its peer dependencies with npm:

```bash
npm i @zk-kit/baby-jubjub
```

or yarn:

```bash
yarn add @zk-kit/baby-jubjub
```

### CDN

You can also load it using a `script` tag using [unpkg](https://unpkg.com/):

```html
<script src="https://unpkg.com/@zk-kit/baby-jubjub"></script>
```

or [JSDelivr](https://www.jsdelivr.com/):

```html
<script src="https://cdn.jsdelivr.net/npm/@zk-kit/baby-jubjub"></script>
```

## 📜 Usage

\# **addPoint**(p1: _Point\<bigint>_, p2: _Point\<bigint>_): _bigint_

```typescript
import { addPoint } from "@zk-kit/baby-jubjub"

const p1: Point<bigint> = [BigInt(0), BigInt(1)]

const newPoint = addPoint(p1, Base8)
```

\# **mulPointEscalar**(base: _Point\<bigint>_, e: _bigint_): _Point\<bigint>_

```typescript
import { Base8, mulPointEscalar } from "@zk-kit/baby-jubjub"

const secretScalar = BigInt(324)

const publicKey = mulPointEscalar(Base8, secretScalar)
```

\# **mulPointEscalar**(base: _Point\<bigint>_, e: _bigint_): _Point\<bigint>_

```typescript
import { inCurve, Base8, mulPointEscalar } from "@zk-kit/baby-jubjub"

const secretScalar = BigInt(324)

const publicKey = mulPointEscalar(Base8, secretScalar)

const isInCurve = inCurve(publicKey)
```

\# **packPoint**(unpackedPoint: _Point\<bigint>_): _bigint_

```typescript
import { packPoint, Base8, mulPointEscalar } from "@zk-kit/baby-jubjub"

const secretScalar = BigInt(324)

const publicKey = mulPointEscalar(Base8, secretScalar)

const packedPoint = packPoint(publicKey)
```

\# **unpackPoint**(packedPoint: _bigint_): _Point\<bigint>_ | _null_

```typescript
import { packPoint, unpackPoint, Base8, mulPointEscalar } from "@zk-kit/baby-jubjub"

const secretScalar = BigInt(324)

const publicKey = mulPointEscalar(Base8, secretScalar)

const packedPoint = packPoint(publicKey)

const unpackedPoint = unpackPoint(packedPoint)

console.log(publicKey[0] === unpackedPoint[0]) // true
console.log(publicKey[1] === unpackedPoint[1]) // true
```
