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
    <a href="https://coveralls.io/github/appliedzkp/zk-kit">
        <img alt="Coveralls" src="https://img.shields.io/coveralls/github/appliedzkp/zk-kit?label=coverage (ts)&style=flat-square&logo=coveralls">
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
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://discord.gg/9B9WgGP6YM">
            🗣️ Chat &amp; Support
        </a>
    </h4>
</div>

| ZK-kit is a set of NPM modules (algorithms or utility functions) that can be reused in different projects and zero-knowledge protocols, making it easier for developers to access ready-to-use and tested libraries for common tasks. |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

♚ Simplified package management with [Lerna](https://lerna.js.org/) (`yarn`, `yarn build`, `yarn publish:fp`)\
♛ [Conventional Commits](https://www.conventionalcommits.org) for adding human and machine readable meaning to commit messages (`yarn commit`)\
♜ [Jest](https://jestjs.io/) tests & common test coverage for all packages (`yarn test`)\
♞ [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) to keep the code neat and well organized (`yarn prettier` & `yarn lint`)\
♝ Automatic deployment of documentation generated with [typedocs](https://typedoc.org/)\
♟ Simple benchmarking framework for JavaScript/TypeScript libraries with [Benny](https://github.com/caderek/benny) (`yarn benchmarks`)

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
                 <a href="https://appliedzkp.github.io/zk-kit/identity">
                    (docs)
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
                 <a href="https://appliedzkp.github.io/zk-kit/protocols">
                    (docs)
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
            <td></td>
        </tr>
        <tr>
            <td>
                <a href="https://github.com/appliedzkp/zk-kit/tree/main/packages/incremental-merkle-tree">
                    @zk-kit/incremental-merkle-tree
                </a>
                 <a href="https://appliedzkp.github.io/zk-kit/incremental-merkle-tree">
                    (docs)
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
                <a href="https://github.com/appliedzkp/zk-kit/tree/main/packages/incremental-merkle-tree.sol">
                    @zk-kit/incremental-merkle-tree.sol
                </a>
            </td>
            <td>
                <!-- NPM version -->
                <a href="https://npmjs.org/package/@zk-kit/incremental-merkle-tree.sol">
                    <img src="https://img.shields.io/npm/v/@zk-kit/incremental-merkle-tree.sol.svg?style=flat-square" alt="NPM version" />
                </a>
            </td>
            <td>
                <!-- Downloads -->
                <a href="https://npmjs.org/package/@zk-kit/incremental-merkle-tree.sol">
                    <img src="https://img.shields.io/npm/dm/@zk-kit/incremental-merkle-tree.sol.svg?style=flat-square" alt="Downloads" />
                </a>
            </td>
            <td></td>
        </tr>
        <tr>
            <td>
                <a href="https://github.com/appliedzkp/zk-kit/tree/main/packages/sparse-merkle-tree">
                    @zk-kit/sparse-merkle-tree
                </a>
                 <a href="https://appliedzkp.github.io/zk-kit/sparse-merkle-tree">
                    (docs)
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
        <tr>
            <td>
                <a href="https://github.com/appliedzkp/zk-kit/tree/main/packages/rollup-plugin-rust">
                    @zk-kit/rollup-plugin-rust
                </a>
            </td>
            <td>
                <!-- NPM version -->
                <a href="https://npmjs.org/package/@zk-kit/rollup-plugin-rust">
                    <img src="https://img.shields.io/npm/v/@zk-kit/rollup-plugin-rust.svg?style=flat-square" alt="NPM version" />
                </a>
            </td>
            <td>
                <!-- Downloads -->
                <a href="https://npmjs.org/package/@zk-kit/rollup-plugin-rust">
                    <img src="https://img.shields.io/npm/dm/@zk-kit/rollup-plugin-rust.svg?style=flat-square" alt="Downloads" />
                </a>
            </td>
            <td>
                <!-- Size -->
                <a href="https://bundlephobia.com/package/@zk-kit/rollup-plugin-rust">
                    <img src="https://img.shields.io/bundlephobia/minzip/@zk-kit/rollup-plugin-rust" alt="npm bundle size (scoped)" />
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

## ❓ FAQ

#### I have a library that could be reused in other projects. How can I integrate it on ZK-kit?

ZK-kit provides a set of pre-configured development tools. All you have to deal with is your own code, testing and documentation. To create a package follow these steps:

1. Fork this repository and clone it (or simply clone it directly if you are a collaborator),
2. Copy one of our current libraries and update the `README.md` and `package.json` files with your package name:

```bash
cd zk-kit
cp -r packages/sparse-merkle-tree packages/my-package
cd packages/my-package && rm -fr node_modules dist
grep -r -l "sparse-merkle-tree" . | xargs sed -i 's/sparse-merkle-tree/my-package/'
# Update the remaining description/usage sections, and write your code in the src & tests folders!
```

#### How can I test and publish my library?

ZK-kit provides two commands: `yarn test` and `yarn publish:fp`. Both must be run from the root folder. `yarn test` will test all packages in the monorepo, including yours using the files inside your `packages/my-package/tests` folder. `yarn publish:fp` can only be run by those who own the NPM token of the ZK-kit organization. They will then have to publish your package. This task could be automated in the future.

#### How can I create benchmarks for my library?

You can see some examples in the `benchmarks` folder. All you have to do is create a file that exports a function to run your benchmark in that folder, and add that function to the `index.ts` file. The `yarn benchmarks` command can be run with no parameters (it will run all the benchmarks), or you can specify the name of your benchmark file to run just that. When you run the command it will creates a `benchmarks/results` folder with your results.

#### How can I publish the documentation of my library with typedocs?

You just need to insert the NPM `docs` command in your `package.json` file, as in the other packages. This command will be executed by Lerna and the output of `typedocs` will be placed in the `docs` folder of the root directory, which will be used to deploy the documentation websites by the Github `docs` workflow whenever the `main` branch is updated.
