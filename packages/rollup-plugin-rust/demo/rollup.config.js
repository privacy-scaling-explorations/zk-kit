// eslint-disable-next-line import/no-unresolved
import rust from "@zk-kit/rollup-plugin-rust"
import { terser } from "rollup-plugin-terser"
import fs from "fs"

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"))
const name = pkg.name.substr(1).replace(/[-/]./g, (x) => x.toUpperCase()[1])
const banner = `/**
 * @module ${pkg.name}
 * @version ${pkg.version}
 * @file ${pkg.description}
 * @copyright ${pkg.author.name} ${new Date().getFullYear()}
 * @license ${pkg.license}
 * @see [Github]{@link ${pkg.homepage}}
*/`

export default {
  input: "Cargo.toml",
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
  plugins: [
    rust({
      serverPath: "dist/",
      inlineWasm: true
    })
  ]
}
