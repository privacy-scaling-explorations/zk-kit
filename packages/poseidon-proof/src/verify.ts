import { groth16 } from "snarkjs"
import { unpackGroth16Proof } from "@zk-kit/utils/proof-packing"
import hash from "./hash"
import { PoseidonProof } from "./types"
import verificationKeys from "./verification-keys.json"

/**
 * Verifies that a Poseidon proof is valid.
 * @param proof PoseidonProof
 * @returns True if the proof is valid, false otherwise.
 */
export default function verify({ numberOfInputs, scope, digest, proof }: PoseidonProof): Promise<boolean> {
    const verificationKey = {
        ...verificationKeys,
        vk_delta_2: verificationKeys.vk_delta_2[numberOfInputs - 1],
        IC: verificationKeys.IC[numberOfInputs - 1]
    }

    return groth16.verify(verificationKey, [digest, hash(scope)], unpackGroth16Proof(proof))
}
