import commonjs from "@rollup/plugin-commonjs"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import fs from "fs"
import nodePolyfills from "rollup-plugin-polyfill-node"
import cleanup from "rollup-plugin-cleanup"
import { terser } from "rollup-plugin-terser"
import typescript from "rollup-plugin-typescript2"

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"))
const banner = `/**
 * @module ${pkg.name}
 * @version ${pkg.version}
 * @file ${pkg.description}
 * @copyright Ethereum Foundation ${new Date().getFullYear()}
 * @license ${pkg.license}
 * @see [Github]{@link ${pkg.homepage}}
*/`

const name = pkg.name.split("/")[1].replace(/[-/]./g, (x: string) => x.toUpperCase()[1])

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
        }
    ],
    external: [],
    plugins: [
        typescript({ tsconfig: "./build.tsconfig.json", useTsconfigDeclarationDir: true }),
        commonjs(),
        nodeResolve({
            preferBuiltins: true
        }),
        nodePolyfills({ include: null }),
        cleanup({ comments: "jsdoc" })
    ]
}
