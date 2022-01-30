import typescript from "@rollup/plugin-typescript"
import fs from "fs"
import cleanup from "rollup-plugin-cleanup"

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"))
const banner = `/**
 * @module ${pkg.name}
 * @version ${pkg.version}
 * @file ${pkg.description}
 * @copyright ${pkg.author.name} ${new Date().getFullYear()}
 * @license ${pkg.license}
 * @see [Github]{@link ${pkg.homepage}}
*/`

export default {
  input: "src/index.ts",
  output: [
    { file: pkg.exports.require, format: "cjs", banner, exports: "auto" },
    { file: pkg.exports.import, format: "es", banner }
  ],
  external: ["fs", "glob", "path", "child_process", "toml", "rimraf", "os", "rollup-pluginutils"],
  plugins: [typescript({ tsconfig: "./build.tsconfig.json" }), cleanup({ comments: "jsdoc" })]
}
