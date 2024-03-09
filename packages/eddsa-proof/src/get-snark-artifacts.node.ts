/* istanbul ignore file */
import { createWriteStream, existsSync, readdirSync } from "node:fs"
import { mkdir } from "node:fs/promises"
import os from "node:os"
import { dirname } from "node:path"
import { Readable } from "node:stream"
import { finished } from "node:stream/promises"
import { SnarkArtifacts } from "./types"
import { defaultSnarkArtifacts } from "./config"

async function download(url: string, outputPath: string) {
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }

    // Ensure the directory exists.
    const dir = dirname(outputPath)
    await mkdir(dir, { recursive: true })

    const fileStream = createWriteStream(outputPath)
    await finished(Readable.fromWeb(response.body as any).pipe(fileStream))
}

export default async function getSnarkArtifacts(): Promise<SnarkArtifacts> {
    const tmpDir = "eddsa-proof"
    const tmpPath = `${os.tmpdir()}/${tmpDir}`

    if (!existsSync(tmpPath) || readdirSync(tmpPath).length !== 2) {
        await download(defaultSnarkArtifacts.wasmFilePath, `${tmpPath}/eddsa-proof.wasm`)
        await download(defaultSnarkArtifacts.zkeyFilePath, `${tmpPath}/eddsa-proof.zkey`)
    }

    return {
        wasmFilePath: `${tmpPath}/eddsa-proof.wasm`,
        zkeyFilePath: `${tmpPath}/eddsa-proof.zkey`
    }
}
