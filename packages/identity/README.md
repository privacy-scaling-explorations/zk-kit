<p align="center">
    <h1 align="center">
        Semaphore identities
    </h1>
    <p align="center">Library for managing identites for Semaphore and Rln protocols.</p>
</p>

<p align="center">
    <a href="https://github.com/appliedzkp/libsemaphore/blob/master/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/appliedzkp/libsemaphore.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@libsem/identity">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@libsem/identity?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@libsem/identity">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@libsem/identity.svg?style=flat-square" />
    </a>
    <a href="https://bundlephobia.com/package/@libsem/identity">
        <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/@libsem/identity" />
    </a>
    <a href="https://eslint.org/">
        <img alt="Linter eslint" src="https://img.shields.io/badge/linter-eslint-8080f2?style=flat-square&logo=eslint" />
    </a>
    <a href="https://prettier.io/">
        <img alt="Code style prettier" src="https://img.shields.io/badge/code%20style-prettier-f8bc45?style=flat-square&logo=prettier" />
    </a>
</p>

---

## 🛠 Install

### npm or yarn

Install the `@libsem/identity` package with npm:

```bash
npm i @libsem/identity
```

or yarn:

```bash
yarn add @libsem/identity
```

## 📜 Usage

**Import**

```typescript
import { ZkIdentity, Identity } from "@libsem/identity"
```

```javascript
const { ZkIdentity } = require("@libsem/identity")
```

**Mainpulation**

```typescript
const identity: Identity = ZkIdentity.genIdentity()
const identityCommitment: bigint = ZkIdentity.genIdentityCommitment(identity)
```

**Serialization**

```typescript
const identity: Identity = ZkIdentity.genIdentity()
const serialized: string = ZkIdentity.serializeIdentity(identity)
const unserialized: Identity = ZkIdentity.unSerializeIdentity(serialized)
```
