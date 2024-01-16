import { verify as _verify } from "@zk-kit/groth16"
import hash from "./hash"
import { PoseidonProof } from "./types"
import unpackProof from "./unpack-proof"
import verificationKeys from "./verification-keys.json"

/**
 * Verifies that a Poseidon proof is valid.
 * @param poseidonProof The Poseidon zero-knowledge proof.
 * @returns True if the proof is valid, false otherwise.
 */
export default function verify(
    numberOfInputs: number,
    { scope, digest, nullifier, proof }: PoseidonProof
): Promise<boolean> {
    const verificationKey = {
        ...verificationKeys,
        vk_delta_2: verificationKeys.vk_delta_2[numberOfInputs - 1],
        IC: verificationKeys.IC[numberOfInputs - 1]
    }

    return _verify(verificationKey, {
        publicSignals: [digest, nullifier, hash(scope)],
        proof: unpackProof(proof)
    })
}
