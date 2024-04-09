import { getZkkitArtifactUrl } from "./config"
import { ArtifactType, ProofType, RequiredInputs, SnarkArtifacts } from "../types"

// function overloading to have better type checking while still being able to encapsulate
function GetSnarkArtifacts(proofType: ProofType.POSEIDON): (numberOfInputs: number) => Promise<SnarkArtifacts>
function GetSnarkArtifacts(proofType: ProofType.EDDSA): () => Promise<SnarkArtifacts>
function GetSnarkArtifacts(
    proofType: ProofType
): (numberOfInputs?: RequiredInputs<typeof proofType>) => Promise<SnarkArtifacts> {
    return async (numberOfInputs?: number) => {
        if (proofType === ProofType.POSEIDON && numberOfInputs === undefined) {
            throw new Error("numberOfInputs is required for Poseidon proof")
        }
        return {
            wasmFilePath: getZkkitArtifactUrl(proofType, ArtifactType.WASM, numberOfInputs),
            zkeyFilePath: getZkkitArtifactUrl(proofType, ArtifactType.ZKEY, numberOfInputs)
        }
    }
}
export const getPoseidonSnarkArtifacts = GetSnarkArtifacts(ProofType.POSEIDON)
export const getEdDSASnarkArtifacts = GetSnarkArtifacts(ProofType.EDDSA)
