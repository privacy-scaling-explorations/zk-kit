import { GetSnarkArtifactUrl, URLS } from "./config"
import { Artifact, Proof, SnarkArtifacts } from "../types"

export function GetSnarkArtifacts({
    artifactsHostUrl,
    proof
}: {
    artifactsHostUrl: string
    proof: Proof.EDDSA
}): () => Promise<SnarkArtifacts>
export function GetSnarkArtifacts({
    artifactsHostUrl,
    proof
}: {
    artifactsHostUrl: string
    proof: Proof.POSEIDON
}): (numberOfInputs: number) => Promise<SnarkArtifacts>
export function GetSnarkArtifacts({
    artifactsHostUrl,
    proof
}: {
    artifactsHostUrl: string
    proof: Proof.SEMAPHORE
}): (treeDepth: number) => Promise<SnarkArtifacts>
export function GetSnarkArtifacts({ artifactsHostUrl, proof }: { artifactsHostUrl: string; proof: Proof }) {
    return proof === Proof.POSEIDON
        ? async (numberOfInputs: number) => ({
              wasmFilePath: GetSnarkArtifactUrl({ artifact: Artifact.WASM, artifactsHostUrl, proof, numberOfInputs }),
              zkeyFilePath: GetSnarkArtifactUrl({ artifact: Artifact.ZKEY, artifactsHostUrl, proof, numberOfInputs })
          })
        : proof === Proof.SEMAPHORE
          ? async (treeDepth: number) => ({
                wasmFilePath: GetSnarkArtifactUrl({ artifact: Artifact.WASM, artifactsHostUrl, proof, treeDepth }),
                zkeyFilePath: GetSnarkArtifactUrl({ artifact: Artifact.ZKEY, artifactsHostUrl, proof, treeDepth })
            })
          : async () => ({
                wasmFilePath: GetSnarkArtifactUrl({ artifact: Artifact.WASM, artifactsHostUrl, proof }),
                zkeyFilePath: GetSnarkArtifactUrl({ artifact: Artifact.ZKEY, artifactsHostUrl, proof })
            })
}

export const getPoseidonSnarkArtifacts = GetSnarkArtifacts({ artifactsHostUrl: URLS.zkkit, proof: Proof.POSEIDON })
export const getEdDSASnarkArtifacts = GetSnarkArtifacts({ artifactsHostUrl: URLS.zkkit, proof: Proof.EDDSA })
export const getSemaphoreSnarkArtifacts = GetSnarkArtifacts({
    artifactsHostUrl: URLS.semaphore,
    proof: Proof.SEMAPHORE
})
