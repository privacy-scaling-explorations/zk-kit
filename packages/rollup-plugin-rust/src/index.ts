import path from "path"
import type { Plugin, PluginContext } from "rollup"
import { createFilter } from "rollup-pluginutils"
import toml from "toml"
import { InternalPluginOptions, PluginOptions } from "./types"
import { exec, glob, readFile, rm } from "./utils"

async function wasmPack(options: InternalPluginOptions, source: string, dir: string) {
  const { name } = toml.parse(source).package
  const outDir = path.resolve(`target/wasm-pack/${name}`)
  const args = [
    "--log-level",
    options.verbose ? "info" : "error",
    "build",
    "--out-dir",
    outDir,
    "--out-name",
    "index",
    "--target",
    "web",
    options.debug ? "--dev" : "--release",
    "--"
  ].concat(options.cargoArgs)

  // Removes the old out directory.
  await rm(outDir)

  // Runs the 'wasm-pack' command.
  await exec("wasm-pack", args, dir)

  // Get the wasm code.
  const wasm = await readFile(`${outDir}/index_bg.wasm`)
  const base64Decode = `
    const base64codes = [62,0,0,0,63,52,53,54,55,56,57,58,59,60,61,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,0,0,0,0,0,0,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];

    function getBase64Code(charCode) {
        return base64codes[charCode - 43];
    }

    function base64_decode(str) {
        let missingOctets = str.endsWith("==") ? 2 : str.endsWith("=") ? 1 : 0;
        let n = str.length;
        let result = new Uint8Array(3 * (n / 4));
        let buffer;

        for (let i = 0, j = 0; i < n; i += 4, j += 3) {
            buffer =
                getBase64Code(str.charCodeAt(i)) << 18 |
                getBase64Code(str.charCodeAt(i + 1)) << 12 |
                getBase64Code(str.charCodeAt(i + 2)) << 6 |
                getBase64Code(str.charCodeAt(i + 3));
            result[j] = buffer >> 16;
            result[j + 1] = (buffer >> 8) & 0xFF;
            result[j + 2] = buffer & 0xFF;
        }

        return result.subarray(0, result.length - missingOctets);
    }`

  return {
    code: `
        import * as exports from "./${path.relative(dir, `${outDir}/index.js`)}";

        ${base64Decode}

        const wasm_code = base64_decode("${wasm.toString("base64")}");

        export default async () => {
            await exports.default(wasm_code);
            return exports;
        };`,
    map: { mappings: "" },
    moduleSideEffects: false
  }
}

async function watchFiles(plugin: PluginContext, options: InternalPluginOptions, dir: string) {
  if (plugin.meta.watchMode) {
    const matches = await Promise.all(options.watchPatterns.map((pattern) => glob(pattern, dir)))

    matches.forEach((files) => {
      files.forEach((file) => {
        plugin.addWatchFile(file)
      })
    })
  }
}

async function build(plugin: PluginContext, options: InternalPluginOptions, source: string, id: string): Promise<any> {
  const dir = path.dirname(id)

  const [output] = await Promise.all([wasmPack(options, source, dir), watchFiles(plugin, options, dir)])

  return output
}

/**
 * Rollup plugin main function.
 * @param externalOptions The plugin options.
 * @returns The Rollup plugin object.
 */
export default function rust(externalOptions?: PluginOptions): Plugin {
  const options: InternalPluginOptions = {
    // Default options:
    debug: true,
    verbose: false,
    cargoArgs: [],
    watchPatterns: ["src/**"],
    include: null,
    exclude: null,
    ...externalOptions
  }
  const filter = createFilter(options.include, options.exclude)

  return {
    name: "rust",
    transform(source, id) {
      if (path.basename(id) === "Cargo.toml" && filter(id)) {
        return build(this, options, source, id)
      }

      return null
    }
  }
}
