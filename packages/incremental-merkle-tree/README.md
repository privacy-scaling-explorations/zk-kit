<p align="center">
    <h1 align="center">
        Incremental Merkle Tree
    </h1>
    <p align="center">Incremental Merkle tree implementation in TypeScript.</p>
</p>

<p align="center">
    <a href="https://github.com/privacy-scaling-explorations/zk-kit">
        <img src="https://img.shields.io/badge/project-zk--kit-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/zk-kit/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/privacy-scaling-explorations/zk-kit.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@zk-kit/incremental-merkle-tree">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@zk-kit/incremental-merkle-tree?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@zk-kit/incremental-merkle-tree">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@zk-kit/incremental-merkle-tree.svg?style=flat-square" />
    </a>
    <a href="https://bundlephobia.com/package/@zk-kit/incremental-merkle-tree">
        <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/@zk-kit/incremental-merkle-tree" />
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
        <a href="https://zkkit.appliedzkp.org//incremental-merkle-tree">
            📘 Docs
        </a>
    </h4>
</div>

---

## 🛠 Install

### npm or yarn

Install the `@zk-kit/incremental-merkle-tree` package with npm:

```bash
npm i @zk-kit/incremental-merkle-tree --save
```

or yarn:

```bash
yarn add @zk-kit/incremental-merkle-tree
```

### CDN

You can also load it using a `script` tag using [unpkg](https://unpkg.com/):

```html
<script src="https://unpkg.com/@zk-kit/incremental-merkle-tree/"></script>
```

or [JSDelivr](https://www.jsdelivr.com/):

```html
<script src="https://cdn.jsdelivr.net/npm/@zk-kit/incremental-merkle-tree/"></script>
```

## 📜 Usage

\# **new IncrementalMerkleTree**(hash: _HashFunction_, depth: _number_, zero: _Node_, arity: _number_, leaves: _Node\[]_): _IncrementalMerkleTree_

```typescript
import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree"
import { poseidon } from "circomlibjs" // v0.0.8

const tree = new IncrementalMerkleTree(poseidon, 16, BigInt(0), 2) // Binary tree.

// Or, if you already have tree leaves to insert:
const leaves = [1, 2, 3]
const tree = new IncrementalMerkleTree(poseidon, 16, BigInt(0), 2, leaves)
```

\# **insert**(leaf: _Node_)

```typescript
tree.insert(BigInt(1))
```

\# **update**(index: _number_, newLeaf: _Node_)

```typescript
tree.update(0, BigInt(2))
```

\# **delete**(index: _number_)

```typescript
tree.delete(0)
```

\# **indexOf**(leaf: _Node_): _number_

```typescript
tree.insert(BigInt(2))

const index = tree.indexOf(BigInt(2))
```

\# **createProof**(index: _number_): _Proof_

```typescript
const proof = tree.createProof(1)
```

\# **verifyProof**(proof: _Proof_): _boolean_

```typescript
console.log(tree.verifyProof(proof)) // true
```

## Contacts

### Developers

-   e-mail : me@cedoor.dev
-   github : [@cedoor](https://github.com/cedoor)
-   website : https://cedoor.dev
