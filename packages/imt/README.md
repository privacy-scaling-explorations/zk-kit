<p align="center">
    <h1 align="center">
        Incremental Merkle Trees
    </h1>
    <p align="center">Incremental Merkle tree implementations in TypeScript.</p>
</p>

<p align="center">
    <a href="https://github.com/privacy-scaling-explorations/zk-kit">
        <img src="https://img.shields.io/badge/project-zk--kit-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/zk-kit/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/privacy-scaling-explorations/zk-kit.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@zk-kit/imt">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@zk-kit/imt?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@zk-kit/imt">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@zk-kit/imt.svg?style=flat-square" />
    </a>
    <a href="https://bundlephobia.com/package/@zk-kit/imt">
        <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/@zk-kit/imt" />
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
        <a href="https://zkkit.pse.dev/modules/_zk_kit_imt.html">
            📘 Docs
        </a>
    </h4>
</div>

---

## 🛠 Install

### npm or yarn

Install the `@zk-kit/imt` package with npm:

```bash
npm i @zk-kit/imt --save
```

or yarn:

```bash
yarn add @zk-kit/imt
```

### CDN

You can also load it using a `script` tag using [unpkg](https://unpkg.com/):

```html
<script src="https://unpkg.com/@zk-kit/imt"></script>
```

or [JSDelivr](https://www.jsdelivr.com/):

```html
<script src="https://cdn.jsdelivr.net/npm/@zk-kit/imt"></script>
```

## 📜 Usage

This package currently provides two implementations of incremental Merkle trees: `IMT` and `LeanIMT`. The former supports several degrees (i.e. arity), while the latter is a binary tree optimization. More information on their properties can be found in the [ZK-Kit documentation](https://zkkit.pse.dev/modules/_zk_kit_imt.html).

### IMT ([doc](https://zkkit.pse.dev/classes/_zk_kit_imt.IMT.html))

```typescript
import { IMT } from "@zk-kit/imt"
import { poseidon2 } from "poseidon-lite"

const depth = 16
const zeroValue = 0
const arity = 2 // Binary tree.

const tree = new IMT(poseidon2, depth, zeroValue, arity)

tree.insert(1)
tree.insert(3)

tree.root
tree.zeroes
tree.arity // 2
tree.depth // 1
tree.leaves // [1, 3]

tree.indexOf(3) // 1

tree.update(1, 2) // tree1.leaves -> [1, 2]

tree.delete(1) // tree1.leaves -> [1, 0]

const proof = tree.createProof(1)

tree.verifyProof(proof) // true

// You can also initialize a tree with a list of leaves.
new IMT(poseidon, depth, zeroValue, arity, [1, 2, 3])
```

### LeanIMT ([doc](https://zkkit.pse.dev/classes/_zk_kit_lean-imt.LeanIMT.html))

```typescript
import { LeanIMT } from "@zk-kit/imt"
import { poseidon2 } from "poseidon-lite"

const hash = (a, b) => poseidon2([a, b])

const tree = new LeanIMT(hash)

tree.insert(1n)
tree.insert(3n)

tree.root
tree.depth // 1
tree.size // 2
tree.leaves // [1n, 3n]

tree.indexOf(3n) // 1
tree.has(4n) // false

tree.update(1, 2n) // tree1.leaves -> [1n, 2n]

const proof = tree.createProof(1)

tree.verifyProof(proof) // true

// You can initialize a tree with a list of leaves.
new LeanIMT(hash, [1n, 2n, 3n])

// LeanIMT is strictly typed. Default type for nodes is 'bigint',
// but you can set your own type.
new LeanIMT<number>((a, b) => a + b)
```
