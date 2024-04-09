import { ArtifactType, ProofType } from "../types"

const ZKKIT_ARTIFACTS_BASE_URL = "https://zkkit.cedoor.dev"
export const ARTIFACTS_TYPES = [ArtifactType.WASM, ArtifactType.ZKEY]

// function overloading to allow nicer type checking while still being able to encapsulate
type GetArtifactUrlFn = {
    (proofType: ProofType.POSEIDON, artifactType: ArtifactType, numberOfInputs: number): string
    (proofType: ProofType.EDDSA, artifactType: ArtifactType): string
}

export function GetSnarkArtifactUrl(artifactsHostUrl: string): GetArtifactUrlFn {
    return (proofType: ProofType, artifactType: ArtifactType, numberOfInputs?: number): string => {
        if (proofType === ProofType.POSEIDON) {
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
}

export const getZkkitArtifactUrl = GetSnarkArtifactUrl(ZKKIT_ARTIFACTS_BASE_URL)
