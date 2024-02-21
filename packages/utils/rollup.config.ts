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

export default {
    input: "src/index.ts",
    output: [
        { file: pkg.exports["."].require, format: "cjs", banner },
        { file: pkg.exports["."].default, format: "es", banner },
        {
            dir: "./dist/lib.commonjs",
            format: "cjs",
            banner,
            preserveModules: true,
            entryFileNames: "[name].cjs"
        },
        { dir: "./dist/lib.esm", format: "es", banner, preserveModules: true }
    ],
    external: [],
    plugins: [typescript({ tsconfig: "./build.tsconfig.json" }), cleanup({ comments: "jsdoc" })]
}
