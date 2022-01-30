import { spawn } from "child_process"
import _fs from "fs"
import _glob from "glob"
import _rimraf from "rimraf"

export function exec(command: string, args: ReadonlyArray<string>, cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, { cwd, stdio: "inherit" })

    childProcess
      .on("close", (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`Command '${childProcess.spawnargs.join(" ")}' failed with error code: ${code}`))
        }
      })
      .on("error", reject)
  })
}

export function glob(pattern: string, cwd?: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    _glob(
      pattern,
      {
        cwd,
        strict: true,
        absolute: true,
        nodir: true
      },
      (error, files) => {
        if (error) {
          reject(error)
        } else {
          resolve(files)
        }
      }
    )
  })
}

export function readFile(path: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    _fs.readFile(path, (error, file) => {
      if (error) {
        reject(error)
      } else {
        resolve(file)
      }
    })
  })
}

export function rm(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    _rimraf(path, { glob: false }, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}
