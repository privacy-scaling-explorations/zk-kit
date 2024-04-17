import { createWriteStream, existsSync } from "node:fs"
import { mkdir } from "node:fs/promises"
import { dirname } from "node:path"
import os from "node:os"
import { SnarkArtifacts, Proof, Artifact, Version } from "../types"
import { GetSnarkArtifactUrls } from "./config"

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

// https://unpkg.com/@zk-kit/poseidon-artifacts@latest/poseidon.wasm -> @zk/poseidon-artifacts@latest/poseidon.wasm
const extractEndPath = (url: string) => url.substring(url.indexOf("@zk"))

async function maybeDownload(url: string) {
    const outputPath = `${os.tmpdir()}/${extractEndPath(url)}`

    if (!existsSync(outputPath)) await download(url, outputPath)

    return outputPath
}

async function maybeGetSnarkArtifact({
    artifact,
    url
}: {
    artifact: Artifact
    url: string
}): Promise<Partial<SnarkArtifacts>> {
    const outputPath = await maybeDownload(url)
    return { [artifact]: outputPath }
}

const maybeGetSnarkArtifacts = async (urls: SnarkArtifacts) =>
    Promise.all(
        Object.entries(urls).map(([artifact, url]) => maybeGetSnarkArtifact({ artifact: artifact as Artifact, url }))
    ).then((artifacts) =>
        artifacts.reduce<SnarkArtifacts>((acc, artifact) => ({ ...acc, ...artifact }), {} as SnarkArtifacts)
    )

function MaybeGetSnarkArtifacts(proof: Proof.EDDSA, version?: Version): () => Promise<SnarkArtifacts>
function MaybeGetSnarkArtifacts(
    proof: Proof.POSEIDON,
    version?: Version
): (numberOfInputs: number) => Promise<SnarkArtifacts>
function MaybeGetSnarkArtifacts(proof: Proof.SEMAPHORE): (treeDepth: number) => Promise<SnarkArtifacts>
function MaybeGetSnarkArtifacts(proof: Proof, version?: Version) {
    switch (proof) {
        case Proof.POSEIDON:
            return async (numberOfInputs: number) =>
                GetSnarkArtifactUrls({ proof, numberOfInputs, version }).then(maybeGetSnarkArtifacts)
        case Proof.SEMAPHORE:
            return async (treeDepth: number) =>
                GetSnarkArtifactUrls({ proof, treeDepth, version }).then(maybeGetSnarkArtifacts)

        case Proof.EDDSA:
            return async () => GetSnarkArtifactUrls({ proof, version }).then(maybeGetSnarkArtifacts)

        default:
            throw new Error("Unknown proof type")
    }
}

export const maybeGetPoseidonSnarkArtifacts = MaybeGetSnarkArtifacts(Proof.POSEIDON)
export const maybeGetEdDSASnarkArtifacts = MaybeGetSnarkArtifacts(Proof.EDDSA)
export const maybeGetSemaphoreSnarkArtifacts = MaybeGetSnarkArtifacts(Proof.SEMAPHORE)
