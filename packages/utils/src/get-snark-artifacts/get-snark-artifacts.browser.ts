import { GetSnarkArtifactUrls } from "./config"
import { Proof, SnarkArtifacts, Version } from "../types"

function MaybeGetSnarkArtifacts(proof: Proof.EDDSA, version?: Version): () => Promise<SnarkArtifacts>
function MaybeGetSnarkArtifacts(
    proof: Proof.POSEIDON,
    version?: Version
): (numberOfInputs: number) => Promise<SnarkArtifacts>
function MaybeGetSnarkArtifacts(
    proof: Proof.SEMAPHORE,
    version?: Version
): (treeDepth: number) => Promise<SnarkArtifacts>
function MaybeGetSnarkArtifacts(proof: Proof, version?: Version) {
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

export const maybeGetPoseidonSnarkArtifacts = MaybeGetSnarkArtifacts(Proof.POSEIDON)
export const maybeGetEdDSASnarkArtifacts = MaybeGetSnarkArtifacts(Proof.EDDSA)
export const maybeGetSemaphoreSnarkArtifacts = MaybeGetSnarkArtifacts(Proof.SEMAPHORE)
