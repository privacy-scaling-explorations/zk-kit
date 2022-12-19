<p align="center">
    <h1 align="center">
        🧰 ZK-kit
    </h1>
    <p align="center">A monorepo of reusable JS libraries for zero-knowledge technologies.</p>
</p>

<p align="center">
    <a href="https://github.com/privacy-scaling-explorations" target="_blank">
        <img src="https://img.shields.io/badge/project-PSE-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/zk-kit/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/privacy-scaling-explorations/zk-kit.svg?style=flat-square">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/zk-kit/actions?query=workflow%3Atest">
        <img alt="GitHub Workflow test" src="https://img.shields.io/github/actions/workflow/status/privacy-scaling-explorations/zk-kit/test.yml?branch=main&label=test&style=flat-square&logo=github">
    </a>
    <a href="https://github.com/privacy-scaling-explorations/zk-kit/actions?query=workflow%3Astyle">
        <img alt="GitHub Workflow style" src="https://img.shields.io/github/actions/workflow/status/privacy-scaling-explorations/zk-kit/style.yml?branch=main&label=style&style=flat-square&logo=github">
    </a>
    <a href="https://coveralls.io/github/privacy-scaling-explorations/zk-kit">
        <img alt="Coveralls" src="https://img.shields.io/coveralls/github/privacy-scaling-explorations/zk-kit?label=coverage (ts)&style=flat-square&logo=coveralls">
    </a>
    <a href="https://eslint.org/">
        <img alt="Linter eslint" src="https://img.shields.io/badge/linter-eslint-8080f2?style=flat-square&logo=eslint">
    </a>
    <a href="https://prettier.io/">
        <img alt="Code style prettier" src="https://img.shields.io/badge/code%20style-prettier-f8bc45?style=flat-square&logo=prettier">
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
        <a href="https://github.com/privacy-scaling-explorations/zk-kit/issues/new/choose">
            🔎 Issues
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://discord.gg/sF5CT5rzrR">
            🗣️ Chat &amp; Support
        </a>
    </h4>
</div>

| ZK-kit is a set of NPM modules (algorithms or utility functions) that can be reused in different projects and zero-knowledge protocols, making it easier for developers to access ready-to-use and tested libraries for common tasks. |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

♚ [Yarn workspaces](https://yarnpkg.com/features/workspaces): minimal monorepo package management (`yarn`, `yarn build`, `yarn docs`)\
♛ [Conventional Commits](https://www.conventionalcommits.org): human and machine readable meaning to commit messages (`yarn commit`)\
♜ [Jest](https://jestjs.io/): tests and test coverage for all packages (`yarn test`, `yarn test:all`)\
♞ [ESLint](https://eslint.org/), [Prettier](https://prettier.io/): code quality and formatting (`yarn prettier` & `yarn lint`)\
♝ [Typedocs](https://typedoc.org/): documentation generator for TypeScript (`yarn docs`)\
♟ [Benny](https://github.com/caderek/benny): simple benchmarking framework for JavaScript/TypeScript (`yarn benchmarks`)\
♟ [Github actions](https://github.com/features/actions): software workflows for automatic testing, decumentation deploy and code quality checks

## 📦 Packages

<table>
    <th>Package</th>
    <th>Version</th>
    <th>Downloads</th>
    <th>Size</th>
    <tbody>
        <tr>
            <td>
                <a href="https://github.com/privacy-scaling-explorations/zk-kit/tree/main/packages/incremental-merkle-tree">
                    @zk-kit/incremental-merkle-tree
                </a>
                 <a href="https://zkkit.appliedzkp.org/incremental-merkle-tree">
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
                <a href="https://github.com/privacy-scaling-explorations/zk-kit/tree/main/packages/incremental-merkle-tree.sol">
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
                <a href="https://github.com/privacy-scaling-explorations/zk-kit/tree/main/packages/sparse-merkle-tree">
                    @zk-kit/sparse-merkle-tree
                </a>
                 <a href="https://zkkit.appliedzkp.org/sparse-merkle-tree/">
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
                <a href="https://github.com/privacy-scaling-explorations/zk-kit/tree/main/packages/rollup-plugin-rust">
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

## 👥 Ways to contribute

-   🔧 Work on [open issues](https://github.com/privacy-scaling-explorations/zk-kit/contribute)
-   📦 Suggest new [packages](https://github.com/privacy-scaling-explorations/zk-kit/issues/new?assignees=&labels=feature+%3Arocket%3A&template=---package.md&title=)
-   🚀 Share ideas for new [features](https://github.com/privacy-scaling-explorations/zk-kit/issues/new?assignees=&labels=feature+%3Arocket%3A&template=---feature.md&title=)
-   🐛 Create a report if you find any [bugs](https://github.com/privacy-scaling-explorations/zk-kit/issues/new?assignees=&labels=bug+%F0%9F%90%9B&template=---bug.md&title=) in the code

## 🛠 Install

Clone this repository:

```bash
git clone https://github.com/privacy-scaling-explorations/zk-kit.git
```

and install the dependencies:

```bash
cd zk-kit && yarn
```

## 📜 Usage

### Code quality and formatting

Run [ESLint](https://eslint.org/) to analyze the code and catch bugs:

```bash
yarn lint
```

Run [Prettier](https://prettier.io/) to check formatting rules:

```bash
yarn prettier
```

or to automatically format the code:

```bash
yarn prettier:write
```

### Conventional commits

Semaphore uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). A [command line utility](https://github.com/commitizen/cz-cli) to commit using the correct syntax can be used by running:

```bash
yarn commit
```

It will also automatically check that the modified files comply with ESLint and Prettier rules.

### Testing

Run [Jest](https://jestjs.io/) to test the code with coverage:

```bash
yarn test
```

### Build packages

Run [Rollup](https://www.rollupjs.org) to build all the packages:

```bash
yarn build
```

A `dist` folder will be created inside each package.

### Documentation

Run [TypeDoc](https://typedoc.org/) to generate a documentation website for each package:

```bash
yarn docs
```

The output will be placed on the `docs` folder.

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

3. Create an [issue](https://github.com/privacy-scaling-explorations/zk-kit/issues/new?assignees=&labels=feature+%3Arocket%3A&template=---package.md&title=) for your package and open a PR.

#### How can I create benchmarks for my library?

You can see some examples in the `benchmarks` folder. All you have to do is create a file that exports a function to run your benchmark in that folder, and add that function to the `index.ts` file. The `yarn benchmarks` command can be run with no parameters (it will run all the benchmarks), or you can specify the name of your benchmark file to run just that. When you run the command it will creates a `benchmarks/results` folder with your results.

#### How can I publish the documentation of my library with Typedocs?

You just need to insert the NPM `docs` command in your `package.json` file, as in the other packages. This command will be executed by Yarn and the output of `typedocs` will be placed in the `docs` folder of the root directory, which will be used to deploy the documentation websites by the Github `docs` workflow whenever the `main` branch is updated.
