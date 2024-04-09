import { ArtifactType, ProofType } from "../types"

const ZKKIT_ARTIFACTS_BASE_URL = "https://zkkit.cedoor.dev"
export const ARTIFACTS_TYPES = [ArtifactType.WASM, ArtifactType.ZKEY]

export function GetSnarkArtifactUrl(artifactsHostUrl: string) {
    // function overloading to have better type checking while still being able to encapsulate
    function getUrl(proofType: ProofType.EDDSA, artifactType: ArtifactType): string
    function getUrl(proofType: ProofType.POSEIDON, artifactType: ArtifactType, numberOfInputs: number): string
    function getUrl(proofType: ProofType, artifactType: ArtifactType, numberOfInputs?: number): string {
        if (proofType === ProofType.POSEIDON) {
            // just to make compiler happy
            if (numberOfInputs === undefined) {
                throw new Error("numberOfInputs is required for Poseidon proof")
            }
            if (numberOfInputs < 1) {
                throw new Error("numberOfInputs must be greater than 0")
            }
            return `${artifactsHostUrl}/${proofType}-proof/artifacts/${numberOfInputs}/${proofType}-proof.${artifactType}`
        }

        return `${artifactsHostUrl}/${proofType}/artifacts/${proofType}-proof.${artifactType}`
    }
    return getUrl
}

export const getZkkitArtifactUrl = GetSnarkArtifactUrl(ZKKIT_ARTIFACTS_BASE_URL)
