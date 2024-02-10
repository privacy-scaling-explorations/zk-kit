import { verify as _verify } from "@zk-kit/groth16"
import { EddsaProof } from "./types"
import unpackProof from "./unpack-proof"
import verificationKey from "./verification-key.json"
import hash from "./hash"

/**
 * Verifies that a Eddsa proof is valid.
 * @param eddsaProof The Eddsa zero-knowledge proof.
 * @returns True if the proof is valid, false otherwise.
 */
export default function verify({ commitment, scope, proof }: EddsaProof): Promise<boolean> {
    return _verify(verificationKey, {
        publicSignals: [commitment, hash(scope)],
        proof: unpackProof(proof)
    })
}
