import commonjs from "@rollup/plugin-commonjs"
import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript"
import fs from "fs"
import cleanup from "rollup-plugin-cleanup"

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
    plugins: [typescript({ tsconfig: "./build.tsconfig.json" }), commonjs(), cleanup({ comments: "jsdoc" })]
}
