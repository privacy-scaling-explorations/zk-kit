import { createWriteStream, existsSync } from "node:fs"
import { mkdir } from "node:fs/promises"
import os from "node:os"
import { dirname } from "node:path"
import { SnarkArtifacts } from "../types"
import _maybeGetSnarkArtifacts, { Project, projects } from "./snark-artifacts.browser"

async function download(url: string, outputPath: string) {
    const response = await fetch(url)

    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    if (!response.body) throw new Error("Failed to get response body")

    const dir = dirname(outputPath)
    await mkdir(dir, { recursive: true })

    const fileStream = createWriteStream(outputPath)
    const reader = response.body.getReader()

    try {
        const pump = async () => {
            const { done, value } = await reader.read()
            if (done) {
                fileStream.end()
                return
            }

            fileStream.write(Buffer.from(value))
            await pump()
        }

        await pump()
    } catch (error) {
        fileStream.close()
        throw error
    }
}

// https://unpkg.com/@zk-kit/poseidon-artifacts@latest/poseidon.wasm -> @zk/poseidon-artifacts@latest/poseidon.wasm
const extractEndPath = (url: string) => url.substring(url.indexOf("@zk"))

async function maybeDownload(url: string) {
    const outputPath = `${os.tmpdir()}/${extractEndPath(url)}`

    if (!existsSync(outputPath)) await download(url, outputPath)

    return outputPath
}

/**
 * Downloads SNARK artifacts (`wasm` and `zkey`) files if not already present in OS tmp folder.
 * @example
 * ```ts
 * {
 *   wasm: "/tmp/@zk-kit/semaphore-artifacts@latest/semaphore-3.wasm",
 *   zkey: "/tmp/@zk-kit/semaphore-artifacts@latest/semaphore-3.zkey"
 * }
 * ```
 * @returns {@link SnarkArtifacts}
 */
export default async function maybeGetSnarkArtifacts(
    ...pars: Parameters<typeof _maybeGetSnarkArtifacts>
): Promise<SnarkArtifacts> {
    const { wasm: wasmUrl, zkey: zkeyUrl } = await _maybeGetSnarkArtifacts(...pars)
    const [wasm, zkey] = await Promise.all([maybeDownload(wasmUrl), maybeDownload(zkeyUrl)])

    return {
        wasm,
        zkey
    }
}

export { Project, projects }
