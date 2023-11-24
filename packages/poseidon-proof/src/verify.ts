import { verify as _verify } from "@zk-kit/groth16"
import hash from "./hash"
import { PoseidonProof } from "./types"
import unpackProof from "./unpack-proof"
import verificationKey from "./verification-key.json"

/**
 * Verifies that a Poseidon proof is valid.
 * @param poseidonProof The Poseidon zero-knowledge proof.
 * @returns True if the proof is valid, false otherwise.
 */
export default function verify({ scope, digest, nullifier, proof }: PoseidonProof): Promise<boolean> {
    return _verify(verificationKey, {
        publicSignals: [nullifier, digest, hash(scope)],
        proof: unpackProof(proof)
    })
}
