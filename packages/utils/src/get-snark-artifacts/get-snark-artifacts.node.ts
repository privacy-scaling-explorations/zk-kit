import { createWriteStream, existsSync } from "node:fs"
import { mkdir } from "node:fs/promises"
import { dirname } from "node:path"
import os from "node:os"
import { SnarkArtifacts, ProofType } from "../types"
import { ARTIFACT_BASE_URLS, ARTIFACTS_TYPES } from "./config"

const getArtifactBaseUrl = (proofType: ProofType, numberOfInputs?: number): string => {
    if (proofType === ProofType.POSEIDON) {
        if (numberOfInputs === undefined) {
            throw new Error("numberOfInputs is required for Poseidon proof")
        }
        if (numberOfInputs < 1) {
            throw new Error("numberOfInputs must be greater than 0")
        }
        return `${ARTIFACT_BASE_URLS[proofType]}/${numberOfInputs}`
    }
    return ARTIFACT_BASE_URLS[proofType]
}

async function download(url: string, outputPath: string) {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }

    const dir = dirname(outputPath)
    try {
        await mkdir(dir, { recursive: true })
    } catch (error) {
        throw new Error(`Failed to create directory ${dir}: ${(error as Error).message}`)
    }

    const fileStream = createWriteStream(outputPath)
    if (!fileStream) {
        throw new Error(`Failed to create write stream for ${outputPath}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
        throw new Error("Failed to get response body reader")
    }

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

async function maybeDownloadArtifact(url: string, outputPath: string) {
    if (!existsSync(outputPath)) {
        await download(url, outputPath)
    }

    return outputPath
}

async function getSnarkArtifact(
    proofType: ProofType,
    artifactType: string,
    numberOfInputs?: number
): Promise<Partial<SnarkArtifacts>> {
    const url = `${getArtifactBaseUrl(proofType, numberOfInputs)}/${proofType}-proof.${artifactType}`
    let tmpPath = `${os.tmpdir()}/${proofType}-proof`

    if (proofType === ProofType.POSEIDON) {
        tmpPath += `-${numberOfInputs}`
    }

    const artifactUrl = await maybeDownloadArtifact(url, `${tmpPath}/${proofType}-proof.${artifactType}`)
    return { [`${artifactType}FilePath`]: artifactUrl }
}

const GetSnarkArtifacts =
    (proofType: ProofType) =>
    async (numberOfInputs?: number): Promise<SnarkArtifacts> =>
        Promise.all(
            ARTIFACTS_TYPES.map(async (artifactType) => getSnarkArtifact(proofType, artifactType, numberOfInputs))
        ).then((artifacts) =>
            artifacts.reduce<SnarkArtifacts>((acc, artifact) => ({ ...acc, ...artifact }), {} as SnarkArtifacts)
        )

export const getPoseidonSnarkArtifacts = GetSnarkArtifacts(ProofType.POSEIDON)
export const getEddsaSnarkArtifacts = GetSnarkArtifacts(ProofType.EDDSA)
