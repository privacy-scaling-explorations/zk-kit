<p align="center">
    <h1 align="center">
        🧰 ZK-kit
    </h1>
    <p align="center">A monorepo of reusable JS libraries for zero-knowledge technologies.</p>
</p>

<p align="center">
    <a href="https://github.com/appliedzkp/zk-kit/blob/main/LICENSE">
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
    </h4>
</div>



| ZK-kit is a set of NPM modules (algorithms or utility functions) that can be reused in different projects and zero-knowledge protocols, making it easier for developers to access ready-to-use and tested libraries for common tasks. |
| ------------------------------------------------------------------------------------------------------------------------------------ |

♚ Simplified package management with [Lerna](https://lerna.js.org/) (`yarn`, `yarn build`, `yarn publish:fp`)\
♛ [Conventional Commits](https://www.conventionalcommits.org) for adding human and machine readable meaning to commit messages (`yarn commit`)\
♜ [Jest](https://jestjs.io/) tests & common test coverage for all packages (`yarn test`)\
♞ [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) to keep the code neat and well organized (`yarn prettier` & `yarn lint`)\
♝ Simple benchmarking framework for JavaScript/TypeScript libraries with [Benny](https://github.com/caderek/benny) (`yarn benchmark`)

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
                <a href="https://github.com/appliedzkp/zk-kit/tree/main/packages/identity">
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
                <a href="https://github.com/appliedzkp/zk-kit/tree/main/packages/protocols">
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
                <a href="https://github.com/appliedzkp/zk-kit/tree/main/packages/incremental-merkle-tree">
                    @zk-kit/incremental-merkle-tree
                </a>
            </td>
            <td>
                <!-- NPM version -->
                <a href="https://npmjs.org/package/@zk-kit/incremental-merkle-tree">
                    <img src="https://img.shields.io/npm/v/@zk-kit/incremental-merkle-tree.svg?style=flat-square" alt="NPM version" />
                </a>
            </td>
            <td>
                <!-- Downloads -->
                <a href="https://npmjs.org/package/@zk-kit/incremental-merkle-tree">
                    <img src="https://img.shields.io/npm/dm/@zk-kit/incremental-merkle-tree.svg?style=flat-square" alt="Downloads" />
                </a>
            </td>
            <td>
                <!-- Size -->
                <a href="https://bundlephobia.com/package/@zk-kit/incremental-merkle-tree">
                    <img src="https://img.shields.io/bundlephobia/minzip/@zk-kit/incremental-merkle-tree" alt="npm bundle size (scoped)" />
                </a>
            </td>
        </tr>
        <tr>
            <td>
                <a href="https://github.com/appliedzkp/zk-kit/tree/main/packages/sparse-merkle-tree">
                    @zk-kit/sparse-merkle-tree
                </a>
            </td>
            <td>
                <!-- NPM version -->
                <a href="https://npmjs.org/package/@zk-kit/sparse-merkle-tree">
                    <img src="https://img.shields.io/npm/v/@zk-kit/sparse-merkle-tree.svg?style=flat-square" alt="NPM version" />
                </a>
            </td>
            <td>
                <!-- Downloads -->
                <a href="https://npmjs.org/package/@zk-kit/sparse-merkle-tree">
                    <img src="https://img.shields.io/npm/dm/@zk-kit/sparse-merkle-tree.svg?style=flat-square" alt="Downloads" />
                </a>
            </td>
            <td>
                <!-- Size -->
                <a href="https://bundlephobia.com/package/@zk-kit/sparse-merkle-tree">
                    <img src="https://img.shields.io/bundlephobia/minzip/@zk-kit/sparse-merkle-tree" alt="npm bundle size (scoped)" />
                </a>
            </td>
        </tr>
    <tbody>
</table>

## 🛠 Install

Clone this repository and install the dependencies:

```bash
$ git clone https://github.com/appliedzkp/zk-kit.git
$ cd zk-kit && yarn
```

## 📜 Usage

```bash
$ yarn lint # Syntax check with ESLint (yarn lint:fix to fix errors).
$ yarn prettier # Syntax check with Prettier (yarn prettier:fix to fix errors).
$ yarn commit # Interactive Commitizen commit.
$ yarn test # Test all packages (with common coverage).
$ yarn build # Create a JS build for each package.
$ yarn publish:fp # Publish packages on npm.
```

You can see the other npm scripts in the `package.json` file.
