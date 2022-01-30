<p align="center">
    <h1 align="center">
        Rust Rollup Plugin
    </h1>
    <p align="center">Rollup plugin to create WASM/JS libraries from Rust crates.</p>
</p>

<p align="center">
    <a href="https://github.com/appliedzkp/zk-kit">
        <img src="https://img.shields.io/badge/project-zk--kit-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/appliedzkp/zk-kit/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/appliedzkp/zk-kit.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/@zk-kit/rollup-plugin-rust">
        <img alt="NPM version" src="https://img.shields.io/npm/v/@zk-kit/rollup-plugin-rust?style=flat-square" />
    </a>
    <a href="https://npmjs.org/package/@zk-kit/rollup-plugin-rust">
        <img alt="Downloads" src="https://img.shields.io/npm/dm/@zk-kit/rollup-plugin-rust.svg?style=flat-square" />
    </a>
    <a href="https://bundlephobia.com/package/@zk-kit/rollup-plugin-rust">
        <img alt="npm bundle size (scoped)" src="https://img.shields.io/bundlephobia/minzip/@zk-kit/rollup-plugin-rust" />
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
        <a href="https://discord.gg/9B9WgGP6YM">
            🗣️ Chat &amp; Support
        </a>
    </h4>
</div>

---

## 🛠 Install

### npm or yarn

Install the `@zk-kit/rollup-plugin-rust` package with npm:

```bash
npm i @zk-kit/rollup-plugin-rust
```

or yarn:

```bash
yarn add @zk-kit/rollup-plugin-rust
```

## 📜 Usage

```typescript
import rust from "@zk-kit/rollup-plugin-rust"

export default {
  input: "Cargo.toml",
  output: [
    {
      file: "dist/index.js",
      name: "myPackageName",
      format: "iife"
    }
  ],
  plugins: [rust()]
}
```
