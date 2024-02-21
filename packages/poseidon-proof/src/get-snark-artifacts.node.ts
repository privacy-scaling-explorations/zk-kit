/* istanbul ignore file */
import { createWriteStream, existsSync, readdirSync } from "node:fs"
import { mkdir } from "node:fs/promises"
import os from "node:os"
import { dirname } from "node:path"
import { Readable } from "node:stream"
import { finished } from "node:stream/promises"
import { SnarkArtifacts } from "./types"

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

export default async function getSnarkArtifacts(numberOfInputs: number): Promise<SnarkArtifacts> {
    const tmpDir = `poseidon-proof`
    const tmpPath = `${os.tmpdir()}/${tmpDir}-${numberOfInputs}`

    if (!existsSync(tmpPath) || readdirSync(tmpPath).length !== 2) {
        await download(
            `https://zkkit.cedoor.dev/poseidon-proof/artifacts/${numberOfInputs}/poseidon-proof.wasm`,
            `${tmpPath}/poseidon-proof.wasm`
        )
        await download(
            `https://zkkit.cedoor.dev/poseidon-proof/artifacts/${numberOfInputs}/poseidon-proof.zkey`,
            `${tmpPath}/poseidon-proof.zkey`
        )
    }

    return {
        wasmFilePath: `${tmpPath}/poseidon-proof.wasm`,
        zkeyFilePath: `${tmpPath}/poseidon-proof.zkey`
    }
}
