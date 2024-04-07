import { createWriteStream, existsSync } from "node:fs"
import { mkdir } from "node:fs/promises"
import { dirname } from "node:path"
import { Readable } from "node:stream"
import { finished } from "node:stream/promises"
import os from "node:os"
import { ArtifactConfig, SnarkArtifacts, ProofType } from "./types"

const ARTIFACTS_BASE_URL = "https://zkkit.cedoor.dev"

const PROOF_ARTIFACT_CONFIGS: Record<ProofType, ArtifactConfig> = {
    [ProofType.POSEIDON]: {
        baseUrl: `${ARTIFACTS_BASE_URL}/${ProofType.POSEIDON}-proof/artifacts`,
        wasmFileName: `${ProofType.POSEIDON}-proof.wasm`,
        zkeyFileName: `${ProofType.POSEIDON}-proof.zkey`
    },
    [ProofType.EDDSA]: {
        baseUrl: `${ARTIFACTS_BASE_URL}/${ProofType.EDDSA}-proof`,
        wasmFileName: `${ProofType.EDDSA}-proof.wasm`,
        zkeyFileName: `${ProofType.EDDSA}-proof.zkey`
    }
}

const getArtifactConfig = (proofType: ProofType, numberOfInputs?: number): ArtifactConfig => {
    const config = PROOF_ARTIFACT_CONFIGS[proofType]
    let { baseUrl } = config

    if (proofType === ProofType.POSEIDON) {
        if (numberOfInputs === undefined) {
            throw new Error("numberOfInputs is required for Poseidon proof")
        }
        if (numberOfInputs < 1) {
            throw new Error("numberOfInputs must be greater than 0")
        }
        baseUrl += `/${numberOfInputs}/${proofType}-proof`
    }

    return {
        ...config,
        baseUrl
    }
}

async function download(url: string, outputPath: string) {
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }

    const dir = dirname(outputPath)
    await mkdir(dir, { recursive: true })

    const fileStream = createWriteStream(outputPath)
    const readableStream = Readable.fromWeb(response.body as any)
    readableStream.pipe(fileStream)

    readableStream.on("error", (err) => {
        console.error(`Error reading from response stream: ${err.message}`)
        throw err
    })

    fileStream.on("error", (err) => {
        console.error(`Error writing to file stream: ${err.message}`)
        throw err
    })

    await finished(Readable.fromWeb(response.body as any).pipe(fileStream))
}

async function maybeDownloadArtifact(url: string, outputPath: string) {
    if (!existsSync(outputPath)) {
        await download(url, outputPath)
    }

    return {
        [outputPath.endsWith(".wasm") ? "wasmFilePath" : "zkeyFilePath"]: outputPath
    }
}

async function getSnarkArtifacts(proofType: ProofType, numberOfInputs?: number): Promise<Partial<SnarkArtifacts>> {
    let tmpPath = `${os.tmpdir()}/${proofType}-proof`
    if (proofType === ProofType.POSEIDON) {
        tmpPath += `-${numberOfInputs}`
    }

    const { baseUrl, wasmFileName, zkeyFileName } = getArtifactConfig(proofType)
    const downloadArgs = [wasmFileName, zkeyFileName].map((fileName) => ({
        url: `${baseUrl}/${fileName}`,
        outputPath: `${tmpPath}/${fileName}`
    }))

    return await Promise.allSettled(
        downloadArgs.map(({ url, outputPath }) => maybeDownloadArtifact(url, outputPath))
    ).then((results) =>
        results.reduce<Partial<SnarkArtifacts>>((acc, result, index) => {
            if (result.status === "fulfilled") {
                acc = { ...acc, ...result.value }
            } else {
                console.error(`Failed to download ${downloadArgs[index].url}`, result.reason)
            }
            return acc
        }, {})
    )
}

export const getPoseidonSnarkArtifacts = async (numberOfInputs: number) =>
    getSnarkArtifacts(ProofType.POSEIDON, numberOfInputs)

export const getEddsaSnarkArtifacts = getSnarkArtifacts(ProofType.EDDSA)
