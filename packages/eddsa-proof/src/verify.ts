import { unpackGroth16Proof } from "@zk-kit/utils/proof-packing"
import { groth16 } from "snarkjs"
import hash from "./hash"
import { EddsaProof } from "./types"
import verificationKey from "./verification-key.json"

/**
 * Verifies that a Eddsa proof is valid.
 * @param eddsaProof The Eddsa zero-knowledge proof.
 * @returns True if the proof is valid, false otherwise.
 */
export default function verify({ commitment, scope, proof }: EddsaProof): Promise<boolean> {
    return groth16.verify(verificationKey, [commitment, hash(scope)], unpackGroth16Proof(proof))
}
