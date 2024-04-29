import { Artifact, Proof, Version } from "../types"

const CDNS = ["https://cdn.jsdelivr.net/npm", "https://unpkg.com"]
const shuffleCdns = () => CDNS.sort(() => Math.random() - 0.5)
const shuffleUrls = (proof: Proof, version: Version) =>
    shuffleCdns().map((cdn) => `${cdn}/@zk-kit/${proof}-artifacts@${version}/${proof}`)

const getPackageVersions = async (proof: Proof) =>
    fetch(`https://registry.npmjs.org/@zk-kit/${proof}-artifacts`)
        .then((res) => res.json())
        .then((data) => Object.keys(data.versions))

export async function GetSnarkArtifactUrls({
    proof,
    version
}: {
    proof: Proof.EDDSA
    version?: Version
}): Promise<Record<Artifact, string[]>>
export async function GetSnarkArtifactUrls({
    proof,
    numberOfInputs,
    version
}: {
    proof: Proof.POSEIDON
    numberOfInputs: number
    version?: Version
}): Promise<Record<Artifact, string[]>>
export async function GetSnarkArtifactUrls({
    proof,
    treeDepth,
    version
}: {
    proof: Proof.SEMAPHORE
    treeDepth: number
    version?: Version
}): Promise<Record<Artifact, string[]>>
export async function GetSnarkArtifactUrls({
    proof,
    numberOfInputs,
    treeDepth,
    version
}: {
    proof: Proof
    numberOfInputs?: number
    treeDepth?: number
    version?: Version
}) {
    if (version !== undefined) {
        const availableVersions = await getPackageVersions(proof)

        if (!availableVersions.includes(version))
            throw new Error(
                `Version ${version} is not available for ${proof} proofs, available versions are: ${availableVersions}`
            )
    } else {
        version ??= "latest"
    }

    switch (proof) {
        case Proof.EDDSA:
            return {
                [Artifact.WASM]: shuffleUrls(proof, version).map((cdn) => `${cdn}.${Artifact.WASM}`),
                [Artifact.ZKEY]: shuffleUrls(proof, version).map((cdn) => `${cdn}.${Artifact.ZKEY}`)
            }
        case Proof.POSEIDON:
            if (numberOfInputs === undefined) throw new Error("numberOfInputs is required for Poseidon proof")
            if (numberOfInputs < 1) throw new Error("numberOfInputs must be greater than 0")

            return {
                [Artifact.WASM]: shuffleUrls(proof, version).map((cdn) => `${cdn}-${numberOfInputs}.${Artifact.WASM}`),
                [Artifact.ZKEY]: shuffleUrls(proof, version).map((cdn) => `${cdn}-${numberOfInputs}.${Artifact.ZKEY}`)
            }

        case Proof.SEMAPHORE:
            if (treeDepth === undefined) throw new Error("treeDepth is required for Semaphore proof")
            if (treeDepth < 1) throw new Error("treeDepth must be greater than 0")

            return {
                [Artifact.WASM]: shuffleUrls(proof, version).map((cdn) => `${cdn}-${treeDepth}.${Artifact.WASM}`),
                [Artifact.ZKEY]: shuffleUrls(proof, version).map((cdn) => `${cdn}-${treeDepth}.${Artifact.ZKEY}`)
            }

        default:
            throw new Error("Unknown proof type")
    }
}
