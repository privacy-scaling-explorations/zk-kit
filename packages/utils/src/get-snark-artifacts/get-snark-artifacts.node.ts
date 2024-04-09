import { createWriteStream, existsSync } from "node:fs"
import { mkdir } from "node:fs/promises"
import { dirname } from "node:path"
import os from "node:os"
import { SnarkArtifacts, ProofType, ArtifactType, RequiredInputs } from "../types"
import { ARTIFACTS_TYPES, getZkkitArtifactUrl } from "./config"

async function download(url: string, outputPath: string) {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }
    if (!response.body) {
        throw new Error("Failed to get response body")
    }

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

async function maybeDownloadArtifact(url: string, outputPath: string) {
    if (!existsSync(outputPath)) {
        await download(url, outputPath)
    }

    return outputPath
}

async function getSnarkArtifact(
    proofType: ProofType,
    artifactType: ArtifactType,
    numberOfInputs?: number
): Promise<Partial<SnarkArtifacts>> {
    // safe to use non null assertion for numberOfInputs, see GetSnarkArtiFacts RequiredInputs
    if (proofType === ProofType.POSEIDON && numberOfInputs! < 1) {
        throw new Error("numberOfInputs must be greater than 0")
    }

    const url = getZkkitArtifactUrl(proofType, artifactType, numberOfInputs)
    let tmpPath = `${os.tmpdir()}/${proofType}-proof`

    if (proofType === ProofType.POSEIDON) {
        tmpPath += `-${numberOfInputs}`
    }

    const artifactUrl = await maybeDownloadArtifact(url, `${tmpPath}/${proofType}-proof.${artifactType}`)
    return { [`${artifactType}FilePath`]: artifactUrl }
}

// function overloading to have better type checking while still being able to encapsulate
function GetSnarkArtifacts(proofType: ProofType.POSEIDON): (numberOfInputs: number) => Promise<SnarkArtifacts>
function GetSnarkArtifacts(proofType: ProofType.EDDSA): () => Promise<SnarkArtifacts>
function GetSnarkArtifacts(
    proofType: ProofType
): (numberOfInputs: RequiredInputs<typeof proofType>) => Promise<SnarkArtifacts> {
    return async (numberOfInputs?: number): Promise<SnarkArtifacts> =>
        Promise.all(
            ARTIFACTS_TYPES.map(async (artifactType) => getSnarkArtifact(proofType, artifactType, numberOfInputs))
        ).then((artifacts) =>
            artifacts.reduce<SnarkArtifacts>((acc, artifact) => ({ ...acc, ...artifact }), {} as SnarkArtifacts)
        )
}

export const getPoseidonSnarkArtifacts = GetSnarkArtifacts(ProofType.POSEIDON)
export const getEdDSASnarkArtifacts = GetSnarkArtifacts(ProofType.EDDSA)
