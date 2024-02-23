import { Groth16Proof } from "snarkjs"
import { PackedProof } from "./types"

/**
 * Packs a proof into a format compatible with EddsaProof.
 * @param proof The Groth16 proof generated with SnarkJS.
 * @returns The proof compatible with EddsaProof.
 */
export function packProof(proof: Groth16Proof): PackedProof {
    return [
        proof.pi_a[0],
        proof.pi_a[1],
        proof.pi_b[0][1],
        proof.pi_b[0][0],
        proof.pi_b[1][1],
        proof.pi_b[1][0],
        proof.pi_c[0],
        proof.pi_c[1]
    ]
}

/**
 * Unpacks a proof into its original form.
 * @param proof The proof compatible with EddsaProof.
 * @returns The proof compatible with SnarkJS.
 */
export function unpackProof(proof: PackedProof): Groth16Proof {
    return {
        pi_a: [proof[0], proof[1]],
        pi_b: [
            [proof[3], proof[2]],
            [proof[5], proof[4]]
        ],
        pi_c: [proof[6], proof[7]],
        protocol: "groth16",
        curve: "bn128"
    }
}