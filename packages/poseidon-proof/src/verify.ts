import { verify as _verify } from "@zk-kit/groth16"
import unpackProof from "./unpackProof"
import verificationKey from "./verification-key.json"
import { PoseidonProof } from "./types"

/**
 * Verifies that a Poseidon proof is valid.
 * @param poseidonProof The Poseidon zero-knowledge proof.
 * @returns True if the proof is valid, false otherwise.
 */
export default function verify({ scope, hash, nullifier, proof }: PoseidonProof): Promise<boolean> {
    return _verify(verificationKey, {
        publicSignals: [nullifier, hash, scope],
        proof: unpackProof(proof)
    })
}
