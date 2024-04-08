import { ProofType, SnarkArtifacts } from "../types"
import { ARTIFACTS_BASE_URL } from "./config"

export async function getPoseidonSnarkArtifacts(numberOfInputs: number): Promise<SnarkArtifacts> {
    return {
        wasmFilePath: `${ARTIFACTS_BASE_URL}/${ProofType.POSEIDON}-proof/artifacts/${numberOfInputs}/${ProofType.POSEIDON}-proof.wasm`,
        zkeyFilePath: `${ARTIFACTS_BASE_URL}/${ProofType.POSEIDON}-proof/artifacts/${numberOfInputs}/${ProofType.POSEIDON}-proof.zkey`
    }
}

export async function getEddsaSnarkArtifacts(): Promise<SnarkArtifacts> {
    return {
        wasmFilePath: `${ARTIFACTS_BASE_URL}/${ProofType.EDDSA}-proof/${ProofType.EDDSA}-proof.wasm`,
        zkeyFilePath: `${ARTIFACTS_BASE_URL}/${ProofType.EDDSA}-proof/${ProofType.EDDSA}-proof.zkey`
    }
}
