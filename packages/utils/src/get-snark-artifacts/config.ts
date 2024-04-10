import { Artifact, Proof } from "../types"

export const URLS = {
    zkkit: "https://zkkit.cedoor.dev",
    semaphore: "https://semaphore.cedoor.dev"
}

export const ARTIFACTS = Object.values(Artifact)

export function GetSnarkArtifactUrl({
    artifact,
    artifactsHostUrl,
    proof
}: {
    artifact: Artifact
    artifactsHostUrl: string
    proof: Proof.EDDSA
}): string
export function GetSnarkArtifactUrl({
    artifact,
    artifactsHostUrl,
    numberOfInputs,
    proof
}: {
    artifact: Artifact
    artifactsHostUrl: string
    proof: Proof.POSEIDON
    numberOfInputs: number
}): string
export function GetSnarkArtifactUrl({
    artifact,
    artifactsHostUrl,
    proof,
    treeDepth
}: {
    artifact: Artifact
    artifactsHostUrl: string
    proof: Proof.SEMAPHORE
    treeDepth: number
}): string
export function GetSnarkArtifactUrl({
    artifact,
    artifactsHostUrl,
    proof,
    numberOfInputs,
    treeDepth
}: {
    artifact: Artifact
    artifactsHostUrl: string
    proof: Proof
    numberOfInputs?: number
    treeDepth?: number
}) {
    if (proof === Proof.POSEIDON) {
        if (numberOfInputs === undefined) {
            throw new Error("numberOfInputs is required for Poseidon proof")
        }
        if (numberOfInputs < 1) {
            throw new Error("numberOfInputs must be greater than 0")
        }
        return `${artifactsHostUrl}/${proof}-proof/artifacts/${numberOfInputs}/${proof}-proof.${artifact}`
    }

    if (proof === Proof.SEMAPHORE) {
        if (treeDepth === undefined) {
            throw new Error("treeDepth is required for Semaphore proof")
        }
        if (treeDepth < 1) {
            throw new Error("treeDepth must be greater than 0")
        }
        return `${artifactsHostUrl}/artifacts/${treeDepth}/${proof}.${artifact}`
    }

    return `${artifactsHostUrl}/${proof}-proof/${proof}-proof.${artifact}`
}
