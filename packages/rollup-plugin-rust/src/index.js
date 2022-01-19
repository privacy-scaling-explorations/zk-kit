import $fs from "fs"
import $glob from "glob"
import $path from "path"
import $child from "child_process"
import $toml from "toml"
import $rimraf from "rimraf"
import $os from "os"
import process from "process"
import { createFilter } from "rollup-pluginutils"

function posixPath(path) {
  return path.replace(/\\/g, $path.posix.sep)
}

function glob(pattern, cwd) {
  return new Promise((resolve, reject) => {
    $glob(
      pattern,
      {
        cwd,
        strict: true,
        absolute: true,
        nodir: true
      },
      (err, files) => {
        if (err) {
          reject(err)
        } else {
          resolve(files)
        }
      }
    )
  })
}

function rm(path) {
  return new Promise((resolve, reject) => {
    $rimraf(path, { glob: false }, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

function read(path) {
  return new Promise((resolve, reject) => {
    $fs.readFile(path, (err, file) => {
      if (err) {
        reject(err)
      } else {
        resolve(file)
      }
    })
  })
}

function wait(p) {
  return new Promise((resolve, reject) => {
    p.on("close", (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command \`${p.spawnargs.join(" ")}\` failed with error code: ${code}`))
      }
    })

    p.on("error", reject)
  })
}

const lockState = {
  locked: false,
  pending: []
}

async function lock(f) {
  if (lockState.locked) {
    await new Promise((resolve) => {
      lockState.pending.push(resolve)
    })

    if (lockState.locked) {
      throw new Error("Invalid lock state")
    }
  }

  lockState.locked = true

  try {
    return f()
  } finally {
    lockState.locked = false

    if (lockState.pending.length !== 0) {
      const resolve = lockState.pending.shift()
      // Wake up pending task
      resolve()
    }
  }
}

function wasm_pack_path(options) {
  if (options.wasmPackPath !== undefined) {
    if (typeof options.wasmPackPath !== "string") {
      throw new Error("'wasmPackPath' option must be a string")
    }

    // https://www.gnu.org/software/bash/manual/html_node/Tilde-Expansion.html
    // eslint-disable-next-line no-useless-escape
    return options.wasmPackPath.replace(/^~(?=$|[\/\\])/, () => $os.homedir())
  }

  if (process.platform === "win32") {
    // TODO pretty hacky, but needed to make it work on Windows
    return "wasm-pack.cmd"
  }

  return "wasm-pack"
}

async function wasm_pack(cx, state, dir, source, id, options) {
  const target_dir = "target"
  const toml = $toml.parse(source)
  const { name } = toml.package
  const out_dir = $path.resolve($path.join(target_dir, "wasm-pack", name))

  await rm(out_dir)

  const args = [
    "--log-level",
    options.verbose ? "info" : "error",
    "build",
    "--out-dir",
    out_dir,
    "--out-name",
    "index",
    "--target",
    "web",
    options.debug ? "--dev" : "--release",
    "--"
  ].concat(options.cargoArgs)

  const command = wasm_pack_path(options)

  try {
    // TODO what if it tries to build the same crate multiple times ?
    // TODO maybe it can run `cargo fetch` without locking ?
    await lock(async () => {
      await wait($child.spawn(command, args, { cwd: dir, stdio: "inherit" }))
    })
  } catch (e) {
    if (e.code === "ENOENT") {
      throw new Error("Could not find wasm-pack, please report this as a bug")
    } else if (options.verbose) {
      throw e
    } else {
      throw new Error("Rust compilation failed")
    }
  }

  // TODO better way to generate the path
  const import_path = JSON.stringify(`./${posixPath($path.relative(dir, $path.join(out_dir, "index.js")))}`)
  const wasm = await read($path.join(out_dir, "index_bg.wasm"))

  const base64_decode = `
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
            }
        `

  const wasm_string = JSON.stringify(wasm.toString("base64"))

  return {
    code: `
                    import * as exports from ${import_path};

                    ${base64_decode}

                    const wasm_code = base64_decode(${wasm_string});

                    export default async () => {
                        await exports.default(wasm_code);
                        return exports;
                    };
                `,
    map: { mappings: "" },
    moduleSideEffects: false
  }
}

async function watch_files(cx, dir, options) {
  if (options.watch) {
    const matches = await Promise.all(options.watchPatterns.map((pattern) => glob(pattern, dir)))

    // TODO deduplicate matches ?
    matches.forEach((files) => {
      files.forEach((file) => {
        cx.addWatchFile(file)
      })
    })
  }
}

async function build(cx, state, source, id, options) {
  const dir = $path.dirname(id)

  const [output] = await Promise.all([wasm_pack(cx, state, dir, source, id, options), watch_files(cx, dir, options)])

  return output
}

// eslint-disable-next-line no-undef
export default function rust(options = {}) {
  // TODO should the filter affect the watching ?
  // TODO should the filter affect the Rust compilation ?
  const filter = createFilter(options.include, options.exclude)

  const state = {
    fileIds: new Set()
  }

  if (options.watchPatterns == null) {
    options.watchPatterns = ["src/**"]
  }

  if (options.cargoArgs == null) {
    options.cargoArgs = []
  }

  if (options.verbose == null) {
    options.verbose = false
  }

  return {
    name: "rust",
    buildStart(rollup) {
      state.fileIds.clear()

      if (this.meta.watchMode || rollup.watch) {
        if (options.watch == null) {
          options.watch = true
        }

        if (options.debug == null) {
          options.debug = true
        }
      }
    },
    transform(source, id) {
      if ($path.basename(id) === "Cargo.toml" && filter(id)) {
        return build(this, state, source, id, options)
      }

      return null
    },
    resolveFileUrl(info) {
      if (state.fileIds.has(info.referenceId)) {
        return JSON.stringify(info.fileName)
      }

      return null
    }
  }
}
