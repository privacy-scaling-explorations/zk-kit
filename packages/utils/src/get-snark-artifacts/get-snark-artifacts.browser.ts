import { getZkkitArtifactUrl } from "./config"
import { ArtifactType, ProofType, SnarkArtifacts } from "../types"

function GetSnarkArtifacts(proofType: ProofType.POSEIDON): (numberOfInputs: number) => Promise<SnarkArtifacts>
function GetSnarkArtifacts(proofType: ProofType.EDDSA): () => Promise<SnarkArtifacts>
function GetSnarkArtifacts(proofType: ProofType) {
    if (proofType === ProofType.POSEIDON) {
        return async (numberOfInputs: number) => ({
            wasmFilePath: getZkkitArtifactUrl(proofType, ArtifactType.WASM, numberOfInputs),
            zkeyFilePath: getZkkitArtifactUrl(proofType, ArtifactType.ZKEY, numberOfInputs)
        })
    }

    return async () => ({
        wasmFilePath: getZkkitArtifactUrl(proofType, ArtifactType.WASM),
        zkeyFilePath: getZkkitArtifactUrl(proofType, ArtifactType.ZKEY)
    })
}

export const getPoseidonSnarkArtifacts = GetSnarkArtifacts(ProofType.POSEIDON)
export const getEdDSASnarkArtifacts = GetSnarkArtifacts(ProofType.EDDSA)
