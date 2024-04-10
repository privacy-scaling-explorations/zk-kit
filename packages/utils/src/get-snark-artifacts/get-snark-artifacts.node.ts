import { createWriteStream, existsSync } from "node:fs"
import { mkdir } from "node:fs/promises"
import { dirname } from "node:path"
import os from "node:os"
import { SnarkArtifacts, Proof, Artifact } from "../types"
import { ARTIFACTS, GetSnarkArtifactUrl, URLS } from "./config"

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

async function maybeDownload(url: string, outputPath: string) {
    if (!existsSync(outputPath)) {
        await download(url, outputPath)
    }
    return outputPath
}

async function getSnarkArtifact({
    artifact,
    outputPath,
    url
}: {
    artifact: Artifact
    outputPath: string
    url: string
}): Promise<Partial<SnarkArtifacts>> {
    await maybeDownload(url, outputPath)
    return { [`${artifact}FilePath`]: outputPath }
}

function GetSnarkArtifacts({
    artifactsHostUrl,
    proof
}: {
    artifactsHostUrl: string
    proof: Proof.EDDSA
}): () => Promise<SnarkArtifacts>
function GetSnarkArtifacts({
    artifactsHostUrl,
    proof
}: {
    artifactsHostUrl: string
    proof: Proof.POSEIDON
}): (numberOfInputs: number) => Promise<SnarkArtifacts>
function GetSnarkArtifacts({
    artifactsHostUrl,
    proof
}: {
    artifactsHostUrl: string
    proof: Proof.SEMAPHORE
}): (treeDepth: number) => Promise<SnarkArtifacts>
function GetSnarkArtifacts({ artifactsHostUrl, proof }: { artifactsHostUrl: string; proof: Proof }) {
    const _GetSnarkArtifacts = async (args: Array<{ artifact: Artifact; outputPath: string; url: string }>) =>
        Promise.all(args.map(getSnarkArtifact)).then((artifacts) =>
            artifacts.reduce<SnarkArtifacts>((acc, artifact) => ({ ...acc, ...artifact }), {} as SnarkArtifacts)
        )

    const tmpDir = os.tmpdir()

    if (proof === Proof.POSEIDON) {
        return async (numberOfInputs: number) => {
            const args = ARTIFACTS.map((artifact) => ({
                artifact,
                outputPath: `${tmpDir}/${proof}-proof-${numberOfInputs}`,
                url: GetSnarkArtifactUrl({ artifact, artifactsHostUrl, proof, numberOfInputs })
            }))
            return _GetSnarkArtifacts(args)
        }
    }

    if (proof === Proof.SEMAPHORE) {
        return async (treeDepth: number) => {
            const args = ARTIFACTS.map((artifact) => ({
                artifact,
                outputPath: `${tmpDir}/${proof}-proof-${treeDepth}`,
                url: GetSnarkArtifactUrl({ artifact, artifactsHostUrl, proof, treeDepth })
            }))
            return _GetSnarkArtifacts(args)
        }
    }

    return async () => {
        const args = ARTIFACTS.map((artifact) => ({
            artifact,
            outputPath: `${tmpDir}/${proof}-proof`,
            url: GetSnarkArtifactUrl({ artifact, artifactsHostUrl, proof })
        }))
        return _GetSnarkArtifacts(args)
    }
}

export const getPoseidonSnarkArtifacts = GetSnarkArtifacts({ artifactsHostUrl: URLS.zkkit, proof: Proof.POSEIDON })
export const getEdDSASnarkArtifacts = GetSnarkArtifacts({ artifactsHostUrl: URLS.zkkit, proof: Proof.EDDSA })
export const getSemaphoreSnarkArtifacts = GetSnarkArtifacts({
    artifactsHostUrl: URLS.semaphore,
    proof: Proof.SEMAPHORE
})
