import { ArtifactType, ProofType } from "../types"

const ZKKIT_ARTIFACTS_BASE_URL = "https://zkkit.cedoor.dev"
export const ARTIFACTS_TYPES = [ArtifactType.WASM, ArtifactType.ZKEY]

const getArtifactBaseUrl = (artifactsHostUrl: string, proofType: ProofType, numberOfInputs?: number): string => {
    if (proofType === ProofType.POSEIDON) {
        if (numberOfInputs === undefined) {
            throw new Error("numberOfInputs is required for Poseidon proof")
        }
        if (numberOfInputs < 1) {
            throw new Error("numberOfInputs must be greater than 0")
        }
        return `${artifactsHostUrl}/${ProofType.POSEIDON}-proof/artifacts/${numberOfInputs}`
    }
    return `${artifactsHostUrl}/${ProofType.EDDSA}-proof`
}

export const GetArtifactUrl =
    (artifactsHostUrl: string) =>
    (proofType: ProofType, artifactType: ArtifactType, numberOfInputs?: number): string =>
        `${getArtifactBaseUrl(artifactsHostUrl, proofType, numberOfInputs)}/${proofType}-proof.${artifactType}`

export const getZkkitArtifactUrl = GetArtifactUrl(ZKKIT_ARTIFACTS_BASE_URL)
