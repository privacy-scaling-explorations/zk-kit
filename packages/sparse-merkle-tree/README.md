<p align="center">
    <h1 align="center">
        Sparse Merkle tree
    </h1>
    <p align="center">Sparse Merkle tree implementation in TypeScript.</p>
</p>

<p align="center">
    <a href="https://github.com/privacy-scaling-explorations/zk-kit">
        <img src="https://img.shields.io/badge/project-zk--kit-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/zk-kit/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/privacy-scaling-explorations/zk-kit.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@zk-kit/sparse-merkle-tree">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@zk-kit/sparse-merkle-tree?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@zk-kit/sparse-merkle-tree">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@zk-kit/sparse-merkle-tree.svg?style=flat-square" />
    </a>
    <a href="https://bundlephobia.com/package/@zk-kit/sparse-merkle-tree">
        <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/@zk-kit/sparse-merkle-tree" />
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
        <a href="https://zkkit.pse.dev/modules/_zk_kit_sparse_merkle_tree.html">
            📘 Docs
        </a>
    </h4>
</div>

A sparse Merkle tree is a data structure useful for storing a key/value map where every leaf node of the tree contains the cryptographic hash of a key/value pair and every non leaf node contains the concatenated hashes of its child nodes. Sparse Merkle trees provides a secure and efficient verification of large data sets and they are often used in peer-to-peer technologies. This implementation is an optimized version of the traditional sparse Merkle tree and it is based on the concepts expressed in the papers and resources below.

**Notice**: this library is still not stable and therefore it must be used with care.

## References

1. Rasmus Dahlberg, Tobias Pulls and Roel Peeters. _Efficient Sparse Merkle Trees: Caching Strategies and Secure (Non-)Membership Proofs_. Cryptology ePrint Archive: Report 2016/683, 2016. https://eprint.iacr.org/2016/683.
2. Faraz Haider. _Compact sparse merkle trees_. Cryptology ePrint Archive: Report 2018/955, 2018. https://eprint.iacr.org/2018/955.
3. Jordi Baylina and Marta Bellés. _Sparse Merkle Trees_. https://docs.iden3.io/publications/pdfs/Merkle-Tree.pdf.
4. Vitalik Buterin Fichter. _Optimizing sparse Merkle trees_. https://ethresear.ch/t/optimizing-sparse-merkle-trees/3751.

---

## Install

### npm or yarn

You can install `@zk-kit/sparse-merkle-tree` package with npm:

```bash
npm i @zk-kit/sparse-merkle-tree --save
```

or yarn:

```bash
yarn add @zk-kit/sparse-merkle-tree
```

### CDN

You can also load it using a `script` tag using [unpkg](https://unpkg.com/):

```html
<script src="https://unpkg.com/@zk-kit/sparse-merkle-tree/"></script>
```

or [JSDelivr](https://www.jsdelivr.com/):

```html
<script src="https://cdn.jsdelivr.net/npm/@zk-kit/sparse-merkle-tree/"></script>
```

## 📜 Usage

\# **new SparseMerkleTree**(hash: _HashFunction_, bigNumbers?: _boolean_): _SparseMerkleTree_

```typescript
import { SparseMerkleTree } from "@zk-kit/sparse-merkle-tree"
import sha256 from "crypto-js/sha256"
import { poseidon } from "circomlibjs"

// Hexadecimal hashes.
const hash = (childNodes: ChildNodes) => sha256(childNodes.join("")).toString()
const tree = new SparseMerkleTree(hash)

// Big number hashes.
const hash2 = (childNodes: ChildNodes) => poseidon(childNodes)
const tree2 = new SparseMerkleTree(hash2, true)

console.log(tree.root) // 0
console.log(tree2.root) // 0n
```

\# **add**(key: _string_ | _number_, value: _string_ | _number_): _void_

```typescript
tree.add("2b", "44") // Hexadecimal key/value.
tree.add("16", "78")
tree.add("d", "e7")
tree.add("10", "141")
tree.add("20", "340")

console.log(tree.root) // 31ee2a59741c9c32a32d8c7fafe461cca1ccaf5986c2d592586e3e6482a48645
```

\# **get**(key: _string_ | _number_): _undefined_ | _string_

```typescript
const value = tree.get("16")

console.log(value) // 78
```

\# **update**(key: _string_ | _number_, value: _string_ | _number_): _void_

```typescript
tree.update("16", "79")

const value = tree.get("16")

console.log(value) // 79
```

\# **delete**(key: _string_ | _number_): _void_

```typescript
tree.delete("16")

const value = tree.get("16")

console.log(value) // undefined
```

\# **createProof**(key: _string_ | _number_): _Proof_

```typescript
const membershipProof = tree.createProof("2b")
const nonMembershipProof = tree.createProof("16") // This key has been deleted.

console.log(membershipProof)
/*
{
    entry: [ '2b', '44', '1' ],
    matchingEntry: undefined,
    siblings: [
        '006a0ab15a212e0e0126b81e056b11576628b1ad80792403dbb3a90be2e71d64',
        'f786ce5a843614d7da216d95c0087c1eb29244927feeeeeb658aa60cf124cd5e'
    ],
    root: 'c3c023c84afc0a7bab1dbebcef5f7beaf3d6af4af98e8f481620dec052be7d0d',
    membership: true
}
*/

console.log(nonMembershipProof)
/*
{
    entry: [ '16' ],
    matchingEntry: undefined,
    siblings: [
        '960f23d9fbb44241be53efb7c4d69ac129bb1cb9482dcb6789d3cc7e6de2de2b',
        '2a1aef839e68d1bdf43c1b3b1ed9ef16c27162e8a175898c9ac64a679b0fc825'
    ],
    root: 'c3c023c84afc0a7bab1dbebcef5f7beaf3d6af4af98e8f481620dec052be7d0d',
    membership: false
}
*/
```

\# **verifyProof**(proof: _Proof_): _boolean_

```typescript
console.log(tree.verifyProof(membershipProof)) // true
console.log(tree.verifyProof(nonMembershipProof)) // true
```

## Contacts

### Developers

-   e-mail : me@cedoor.dev
-   github : [@cedoor](https://github.com/cedoor)
-   website : https://cedoor.dev
