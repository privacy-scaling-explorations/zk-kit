<p align="center">
    <h1 align="center">
        ZK-kit
    </h1>
    <p align="center">A monorepo of reusable JS libraries for zero-knowledge technologies.</p>
</p>

<p align="center">
    <a href="https://github.com/appliedzkp/zk-kit/blob/master/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/appliedzkp/zk-kit.svg?style=flat-square">
    </a>
    <a href="https://github.com/appliedzkp/zk-kit/actions?query=workflow%3Atest">
        <img alt="GitHub Workflow test" src="https://img.shields.io/github/workflow/status/appliedzkp/zk-kit/test?label=test&style=flat-square&logo=github">
    </a>
    <a href="https://eslint.org/">
        <img alt="Linter eslint" src="https://img.shields.io/badge/linter-eslint-8080f2?style=flat-square&logo=eslint">
    </a>
    <a href="https://prettier.io/">
        <img alt="Code style prettier" src="https://img.shields.io/badge/code%20style-prettier-f8bc45?style=flat-square&logo=prettier">
    </a>
    <a href="https://lerna.js.org/">
        <img alt="Lerna" src="https://img.shields.io/badge/maintained%20with-lerna-8f6899.svg?style=flat-square">
    </a>
</p>

ZK-kit is a set of NPM modules (algorithms or utility functions) that can be reused in different projects and zero-knowledge protocols, making it easier for developers to access ready-to-use and tested libraries for common tasks.

---

## 📦 Packages

<table>
    <th>Package</th>
    <th>Version</th>
    <th>Downloads</th>
    <th>Size</th>
    <tbody>
        <tr>
            <td>
                <a href="https://github.com/appliedzkp/zk-kit/tree/master/packages/identity">
                    @zk-kit/identity
                </a>
            </td>
            <td>
                <!-- NPM version -->
                <a href="https://npmjs.org/package/@zk-kit/identity">
                    <img src="https://img.shields.io/npm/v/@zk-kit/identity.svg?style=flat-square" alt="NPM version" />
                </a>
            </td>
            <td>
                <!-- Downloads -->
                <a href="https://npmjs.org/package/@zk-kit/identity">
                    <img src="https://img.shields.io/npm/dm/@zk-kit/identity.svg?style=flat-square" alt="Downloads" />
                </a>
            </td>
            <td>
                <!-- Size -->
                <a href="https://bundlephobia.com/package/@zk-kit/identity">
                    <img src="https://img.shields.io/bundlephobia/minzip/@zk-kit/identity" alt="npm bundle size (scoped)" />
                </a>
            </td>
        </tr>
        <tr>
            <td>
                <a href="https://github.com/appliedzkp/zk-kit/tree/master/packages/protocols">
                    @zk-kit/protocols
                </a>
            </td>
            <td>
                <!-- NPM version -->
                <a href="https://npmjs.org/package/@zk-kit/protocols">
                    <img src="https://img.shields.io/npm/v/@zk-kit/protocols.svg?style=flat-square" alt="NPM version" />
                </a>
            </td>
            <td>
                <!-- Downloads -->
                <a href="https://npmjs.org/package/@zk-kit/protocols">
                    <img src="https://img.shields.io/npm/dm/@zk-kit/protocols.svg?style=flat-square" alt="Downloads" />
                </a>
            </td>
            <td>
                <!-- Size -->
                <a href="https://bundlephobia.com/package/@zk-kit/protocols">
                    <img src="https://img.shields.io/bundlephobia/minzip/@zk-kit/protocols" alt="npm bundle size (scoped)" />
                </a>
            </td>
        </tr>
        <tr>
            <td>
                <a href="https://github.com/appliedzkp/zk-kit/tree/master/packages/types">
                    @zk-kit/types
                </a>
            </td>
            <td>
                <!-- NPM version -->
                <a href="https://npmjs.org/package/@zk-kit/types">
                    <img src="https://img.shields.io/npm/v/@zk-kit/types.svg?style=flat-square" alt="NPM version" />
                </a>
            </td>
            <td>
                <!-- Downloads -->
                <a href="https://npmjs.org/package/@zk-kit/types">
                    <img src="https://img.shields.io/npm/dm/@zk-kit/types.svg?style=flat-square" alt="Downloads" />
                </a>
            </td>
            <td>
                <!-- Size -->
            </td>
        </tr>
    <tbody>
</table>

## 🛠 Install

Clone this repository and install the dependencies:

```bash
$ git clone https://github.com/appliedzkp/zk-kit.git
$ cd zk-kit && npm i
```

## 📜 Usage

```bash
$ npm run lint # Lint all packages.
$ npm run test # Test all packages (with common coverage).
$ npm run build # Create a JS build for each package.
$ npm run publish:fp # Publish packages on npm.
```

You can see the other npm scripts in the `package.json` file.
