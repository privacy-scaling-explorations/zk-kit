import { verify as _verify } from "@zk-kit/groth16"
import hash from "./hash"
import { EddsaProof } from "./types"
import unpackProof from "./unpack-proof"
import verificationKey from "./verification-key.json"

/**
 * Verifies that a Poseidon proof is valid.
 * @param eddsaProof The Poseidon zero-knowledge proof.
 * @returns True if the proof is valid, false otherwise.
 */
export default function verify({ scope, commitment, nullifier, proof }: EddsaProof): Promise<boolean> {
    return _verify(verificationKey, {
        proof: unpackProof(proof),
        publicSignals: [nullifier, commitment, hash(scope)]
    })
}
