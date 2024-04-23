import { Artifact, Proof, SnarkArtifacts, Version } from "../types"

const ARTIFACTS_BASE_URL = "https://unpkg.com/@zk-kit"

const getPackageVersions = async (proof: Proof) =>
    fetch(`${ARTIFACTS_BASE_URL}/${proof}-artifacts`)
        .then((res) => res.json())
        .then((data) => Object.keys(data.versions))

export async function GetSnarkArtifactUrls({
    proof,
    version
}: {
    proof: Proof.EDDSA
    version?: Version
}): Promise<SnarkArtifacts>
export async function GetSnarkArtifactUrls({
    proof,
    numberOfInputs,
    version
}: {
    proof: Proof.POSEIDON
    numberOfInputs: number
    version?: Version
}): Promise<SnarkArtifacts>
export async function GetSnarkArtifactUrls({
    proof,
    treeDepth,
    version
}: {
    proof: Proof.SEMAPHORE
    treeDepth: number
    version?: Version
}): Promise<SnarkArtifacts>
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

    const BASE_URL = `https://unpkg.com/@zk-kit/${proof}-artifacts@${version}`

    switch (proof) {
        case Proof.EDDSA:
            return {
                [Artifact.WASM]: `${BASE_URL}/${proof}.${Artifact.WASM}`,
                [Artifact.ZKEY]: `${BASE_URL}/${proof}.${Artifact.ZKEY}`
            }

        case Proof.POSEIDON:
            if (numberOfInputs === undefined) throw new Error("numberOfInputs is required for Poseidon proof")
            if (numberOfInputs < 1) throw new Error("numberOfInputs must be greater than 0")

            return {
                [Artifact.WASM]: `${BASE_URL}/${proof}-${numberOfInputs}.${Artifact.WASM}`,
                [Artifact.ZKEY]: `${BASE_URL}/${proof}-${numberOfInputs}.${Artifact.ZKEY}`
            }

        case Proof.SEMAPHORE:
            if (treeDepth === undefined) throw new Error("treeDepth is required for Semaphore proof")
            if (treeDepth < 1) throw new Error("treeDepth must be greater than 0")

            return {
                [Artifact.WASM]: `${BASE_URL}/${proof}-${treeDepth}.${Artifact.WASM}`,
                [Artifact.ZKEY]: `${BASE_URL}/${proof}-${treeDepth}.${Artifact.ZKEY}`
            }

        default:
            throw new Error("Unknown proof type")
    }
}
