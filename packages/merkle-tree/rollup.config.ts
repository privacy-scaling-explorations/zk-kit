import { nodeResolve } from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import fs from "fs"
import { terser } from "rollup-plugin-terser"

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"))
const banner = `/**
 * @module ${pkg.name}
 * @version ${pkg.version}
 * @file ${pkg.description}
 * @copyright ${pkg.author.name} ${new Date().getFullYear()}
 * @license ${pkg.license}
 * @see [Github]{@link ${pkg.homepage}}
*/`
const name = pkg.name.substr(1).replace(/[-/]./g, (x: string) => x.toUpperCase()[1])

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
    { file: pkg.exports.require, format: "cjs", banner, exports: "auto" },
    { file: pkg.exports.import, format: "es", banner }
  ],
  plugins: [typescript({ tsconfig: "./build.tsconfig.json" }), nodeResolve()]
}
