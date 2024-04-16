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

async function getSnarkArtifact({ artifact, url }: { artifact: Artifact; url: string }) {
    const outputPath = await maybeDownload(url)
    return new Map([[artifact, outputPath]])
}

const getSnarkArtifacts = async (urls: SnarkArtifacts) =>
    Promise.all(Array.from(urls).map(([artifact, url]) => getSnarkArtifact({ artifact, url }))).then((artifacts) =>
        artifacts.reduce<SnarkArtifacts>((acc, artifact) => {
            acc.set(...Array.from(artifact)[0])
            return acc
        }, new Map() as SnarkArtifacts)
    )

function GetSnarkArtifacts(proof: Proof.EDDSA, version?: Version): () => Promise<SnarkArtifacts>
function GetSnarkArtifacts(
    proof: Proof.POSEIDON,
    version?: Version
): (numberOfInputs: number) => Promise<SnarkArtifacts>
function GetSnarkArtifacts(proof: Proof.SEMAPHORE): (treeDepth: number) => Promise<SnarkArtifacts>
function GetSnarkArtifacts(proof: Proof, version?: Version) {
    switch (proof) {
        case Proof.POSEIDON:
            return async (numberOfInputs: number) =>
                GetSnarkArtifactUrls({ proof, numberOfInputs, version }).then(getSnarkArtifacts)
        case Proof.SEMAPHORE:
            return async (treeDepth: number) =>
                GetSnarkArtifactUrls({ proof, treeDepth, version }).then(getSnarkArtifacts)

        case Proof.EDDSA:
            return async () => GetSnarkArtifactUrls({ proof, version }).then(getSnarkArtifacts)

        default:
            throw new Error("Unknown proof type")
    }
}

export const getPoseidonSnarkArtifacts = GetSnarkArtifacts(Proof.POSEIDON)
export const getEdDSASnarkArtifacts = GetSnarkArtifacts(Proof.EDDSA)
export const getSemaphoreSnarkArtifacts = GetSnarkArtifacts(Proof.SEMAPHORE)
