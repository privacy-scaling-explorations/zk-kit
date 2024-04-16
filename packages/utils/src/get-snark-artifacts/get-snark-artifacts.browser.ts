import { GetSnarkArtifactUrls } from "./config"
import { Proof, SnarkArtifacts, Version } from "../types"

function GetSnarkArtifacts(proof: Proof.EDDSA, version?: Version): () => Promise<SnarkArtifacts>
function GetSnarkArtifacts(
    proof: Proof.POSEIDON,
    version?: Version
): (numberOfInputs: number) => Promise<SnarkArtifacts>
function GetSnarkArtifacts(proof: Proof.SEMAPHORE, version?: Version): (treeDepth: number) => Promise<SnarkArtifacts>
function GetSnarkArtifacts(proof: Proof, version?: Version) {
    switch (proof) {
        case Proof.POSEIDON:
            return async (numberOfInputs: number) => GetSnarkArtifactUrls({ proof, numberOfInputs, version })

        case Proof.SEMAPHORE:
            return async (treeDepth: number) => GetSnarkArtifactUrls({ proof, treeDepth, version })

        case Proof.EDDSA:
            return async () => GetSnarkArtifactUrls({ proof, version })

        default:
            throw new Error("Unknown proof type")
    }
}

export const getPoseidonSnarkArtifacts = GetSnarkArtifacts(Proof.POSEIDON)
export const getEdDSASnarkArtifacts = GetSnarkArtifacts(Proof.EDDSA)
export const getSemaphoreSnarkArtifacts = GetSnarkArtifacts(Proof.SEMAPHORE)
