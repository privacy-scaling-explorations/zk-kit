<p align="center">
    <h1 align="center">
        ZK identities
    </h1>
    <p align="center">Library for managing identities for Semaphore and RLN protocols.</p>
</p>

<p align="center">
    <a href="https://github.com/appliedzkp/zk-kit">
        <img src="https://img.shields.io/badge/project-zk--kit-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/appliedzkp/zk-kit/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/appliedzkp/zk-kit.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@zk-kit/identity">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@zk-kit/identity?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@zk-kit/identity">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@zk-kit/identity.svg?style=flat-square" />
    </a>
    <a href="https://bundlephobia.com/package/@zk-kit/identity">
        <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/@zk-kit/identity" />
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
        <a href="/CONTRIBUTING.md">
            👥 Contributing
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="/CODE_OF_CONDUCT.md">
            🤝 Code of conduct
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://github.com/appliedzkp/zk-kit/issues/new/choose">
            🔎 Issues
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://discord.gg/9B9WgGP6YM">
            🗣️ Chat &amp; Support
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://appliedzkp.github.io/zk-kit/identity">
            📘 Docs
        </a>
    </h4>
</div>

---

## 🛠 Install

### npm or yarn

Install the `@zk-kit/identity` package with npm:

```bash
npm i @zk-kit/identity
```

or yarn:

```bash
yarn add @zk-kit/identity
```

## 📜 Usage

**Import**

```typescript
import { ZkIdentity, Identity } from "@zk-kit/identity"
```

```javascript
const { ZkIdentity } = require("@zk-kit/identity")
```

**Mainpulation**

```typescript
const identity: ZkIdentity = new ZkIdentity()
const identityCommitment: bigint = identity.genIdentityCommitment()
```

**Serialization**

```typescript
const identity: ZkIdentity = new ZkIdentity()
const serialized: string = identity.serializeIdentity()
const unserialized: ZkIdentity = ZkIdentity.genFromSerialized(serialized)
```
