import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript"
import fs from "fs"
import cleanup from "rollup-plugin-cleanup"
import alias from "@rollup/plugin-alias"
import json from "@rollup/plugin-json"

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"))
const banner = `/**
 * @module ${pkg.name}
 * @version ${pkg.version}
 * @file ${pkg.description}
 * @copyright Ethereum Foundation ${new Date().getFullYear()}
 * @license ${pkg.license}
 * @see [Github]{@link ${pkg.homepage}}
*/`

const name = pkg.name.substr(1).replace(/[-/]./g, (x: any) => x.toUpperCase()[1])

export default {
    input: "src/index.ts",
    output: [
        {
            file: pkg.iife,
            name,
            format: "iife",
            banner
        },
        {
            file: pkg.unpkg,
            name,
            format: "iife",
            plugins: [terser({ output: { preamble: banner } })]
        },
        {
            file: pkg.exports["."].browser,
            format: "es",
            banner
        }
    ],
    external: Object.keys(pkg.dependencies),
    plugins: [
        alias({
            entries: [{ find: "./crypto.node", replacement: "./crypto.browser" }]
        }),
        typescript({
            tsconfig: "./build.tsconfig.json"
        }),
        cleanup({ comments: "jsdoc" }),
        json()
    ]
}
