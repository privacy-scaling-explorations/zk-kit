import { createWriteStream, existsSync } from "node:fs"
import { mkdir } from "node:fs/promises"
import { dirname } from "node:path"
import os from "node:os"
import { SnarkArtifacts, Proof, Artifact, Version } from "../types"
import { GetSnarkArtifactUrls } from "./config"

const fetchRetry = async (urls: string[]): Promise<ReturnType<typeof fetch>> =>
    fetch(urls[0]).catch(() => fetchRetry(urls.slice(1)))

async function download(urls: string[], outputPath: string) {
    const { body, ok, statusText, url } = await fetchRetry(urls)
    if (!ok) throw new Error(`Failed to fetch ${url}: ${statusText}`)
    if (!body) throw new Error("Failed to get response body")

    const dir = dirname(outputPath)
    await mkdir(dir, { recursive: true })

    const fileStream = createWriteStream(outputPath)
    const reader = body.getReader()

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

async function maybeDownload(urls: string[]) {
    const outputPath = `${os.tmpdir()}/${extractEndPath(urls[0])}`

    if (!existsSync(outputPath)) await download(urls, outputPath)

    return outputPath
}

async function maybeGetSnarkArtifact({
    artifact,
    urls
}: {
    artifact: Artifact
    urls: string[]
}): Promise<Partial<SnarkArtifacts>> {
    const outputPath = await maybeDownload(urls)
    return { [artifact]: outputPath }
}

const maybeGetSnarkArtifacts = async (urls: Record<Artifact, string[]>) =>
    Promise.all(
        Object.entries(urls).map(([artifact, urls]) => maybeGetSnarkArtifact({ artifact: artifact as Artifact, urls }))
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

/**
 * Downloads {@link @zk-kit/eddsa-proof!generate | EdDSA} snark artifacts (`wasm` and `zkey`) files if not already present in OS tmp folder.
 * @example
 * ```
 * {
 *   wasm: "/tmm/@zk-kit/eddsa-artifacts@latest/eddsa.wasm",
 *   zkey: "/tmp/@zk-kit/eddsa-artifacts@latest/eddsa.zkey"
 * }
 * ```
 * @returns {@link SnarkArtifacts}
 */
export const maybeGetEdDSASnarkArtifacts = MaybeGetSnarkArtifacts(Proof.EDDSA)

/**
 * Downloads {@link @zk-kit/poseidon-proof!generate | Poseidon} snark artifacts (`wasm` and `zkey`) files if not already present in OS tmp folder.
 * @param numberOfInputs - The number of inputs to hash
 * @example
 * ```ts
 * {
 *   wasm: "/tmm/@zk-kit/poseidon-artifacts@latest/poseidon-2.wasm",
 *   zkey: "/tmp/@zk-kit/poseidon-artifacts@latest/poseidon-2.zkey"
 * }
 * ```
 * @returns {@link SnarkArtifacts}
 */
export const maybeGetPoseidonSnarkArtifacts = MaybeGetSnarkArtifacts(Proof.POSEIDON)

/**
 * Downloads {@link https://github.com/semaphore-protocol/semaphore/tree/main/packages/proof | Semaphore} snark artifacts (`wasm` and `zkey`) files if not already present in OS tmp folder.
 * @param treeDepth - The depth of the tree
 * @example
 * ```ts
 * {
 *   wasm: "/tmm/@zk-kit/semaphore-artifacts@latest/semaphore-3.wasm",
 *   zkey: "/tmp/@zk-kit/semaphore-artifacts@latest/semaphore-3.zkey"
 * }
 * ```
 * @returns {@link SnarkArtifacts}
 */
export const maybeGetSemaphoreSnarkArtifacts = MaybeGetSnarkArtifacts(Proof.SEMAPHORE)
