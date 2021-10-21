<p align="center">
    <h1 align="center">
        Libsemaphore
    </h1>
    <p align="center">A monorepo of JavaScript libraries for Semaphore.</p>
</p>

<p align="center">
    <a href="https://github.com/appliedzkp/libsemaphore/blob/master/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/appliedzkp/libsemaphore.svg?style=flat-square">
    </a>
    <a href="https://github.com/appliedzkp/libsemaphore/actions?query=workflow%3Atest">
        <img alt="GitHub Workflow test" src="https://img.shields.io/github/workflow/status/appliedzkp/libsemaphore/test?label=test&style=flat-square&logo=github">
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

A library that allows for easy access and interoperability for [Semaphore](https://semaphore.appliedzkp.org/) and [RLN](https://medium.com/privacy-scaling-explorations/rate-limiting-nullifier-a-spam-protection-mechanism-for-anonymous-environments-bbe4006a57d) constructs. It is meant to be used by third-party applications to easily integrate with Seamphore and RLN. The library provides an API (Semaphore and RLN) for:

- Identity generation
- Proof generation
- Proof verification

The library is structured as a three separate npm packages:

- `@libsem/identity`: Exposes utilities for Zk identity generation, necessary for interacting with the Zk protocols supported by this library,
- `@libsem/protocols`: Utilities for proof genration and verification for various Zk protocols,
- `@libsem/types`: Helper package which exposes the types used by `identity` and `protocols` packages.

All the packages provide tests which can be used as a guide for interaction.

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
                <a href="https://github.com/appliedzkp/libsemaphore/tree/master/packages/identity">
                    @libsem/identity
                </a>
            </td>
            <td>
                <!-- NPM version -->
                <a href="https://npmjs.org/package/@libsem/identity">
                    <img src="https://img.shields.io/npm/v/@libsem/identity.svg?style=flat-square" alt="NPM version" />
                </a>
            </td>
            <td>
                <!-- Downloads -->
                <a href="https://npmjs.org/package/@libsem/identity">
                    <img src="https://img.shields.io/npm/dm/@libsem/identity.svg?style=flat-square" alt="Downloads" />
                </a>
            </td>
            <td>
                <!-- Size -->
                <a href="https://bundlephobia.com/package/@libsem/identity">
                    <img src="https://img.shields.io/bundlephobia/minzip/@libsem/identity" alt="npm bundle size (scoped)" />
                </a>
            </td>
        </tr>
        <tr>
            <td>
                <a href="https://github.com/appliedzkp/libsemaphore/tree/master/packages/protocols">
                    @libsem/protocols
                </a>
            </td>
            <td>
                <!-- NPM version -->
                <a href="https://npmjs.org/package/@libsem/protocols">
                    <img src="https://img.shields.io/npm/v/@libsem/protocols.svg?style=flat-square" alt="NPM version" />
                </a>
            </td>
            <td>
                <!-- Downloads -->
                <a href="https://npmjs.org/package/@libsem/protocols">
                    <img src="https://img.shields.io/npm/dm/@libsem/protocols.svg?style=flat-square" alt="Downloads" />
                </a>
            </td>
            <td>
                <!-- Size -->
                <a href="https://bundlephobia.com/package/@libsem/protocols">
                    <img src="https://img.shields.io/bundlephobia/minzip/@libsem/protocols" alt="npm bundle size (scoped)" />
                </a>
            </td>
        </tr>
        <tr>
            <td>
                <a href="https://github.com/appliedzkp/libsemaphore/tree/master/packages/types">
                    @libsem/types
                </a>
            </td>
            <td>
                <!-- NPM version -->
                <a href="https://npmjs.org/package/@libsem/types">
                    <img src="https://img.shields.io/npm/v/@libsem/types.svg?style=flat-square" alt="NPM version" />
                </a>
            </td>
            <td>
                <!-- Downloads -->
                <a href="https://npmjs.org/package/@libsem/types">
                    <img src="https://img.shields.io/npm/dm/@libsem/types.svg?style=flat-square" alt="Downloads" />
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
$ git clone https://github.com/appliedzkp/libsemaphore.git
$ cd libsemaphore && npm i
```

## 📜 Usage

```bash
$ npm run lint # Lint all packages.
$ npm run test # Test all packages (with common coverage).
$ npm run build # Create a JS build for each package.
$ npm run publish # Publish packages on npm.
```

You can see the other npm scripts in the `package.json` file.

