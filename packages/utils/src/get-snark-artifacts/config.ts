import { ArtifactType, ProofType } from "../types"

export const ARTIFACTS_BASE_URL = "https://zkkit.cedoor.dev"
export const ARTIFACTS_TYPES = [ArtifactType.WASM, ArtifactType.ZKEY]
export const ARTIFACT_BASE_URLS: Record<ProofType, string> = {
    [ProofType.POSEIDON]: `${ARTIFACTS_BASE_URL}/${ProofType.POSEIDON}-proof/artifacts`,
    [ProofType.EDDSA]: `${ARTIFACTS_BASE_URL}/${ProofType.EDDSA}-proof`
}
