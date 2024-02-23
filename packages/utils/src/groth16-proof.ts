import { Groth16Proof } from "snarkjs"
import { PackedGroth16Proof } from "./types"

/**
 * Packs a Snarkjs Groth16 proof into a format compatible with Smart Contracts.
 * @param proof The Groth16 proof generated with SnarkJS.
 * @returns The proof compatible with Smart Contracts.
 */
export function packGroth16Proof(proof: Groth16Proof): PackedGroth16Proof {
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
 * Unpacks a Smart Contracts compatible proof into its original form which is a SnarkJS Groth16 proof.
 * @param proof The proof compatible with Smart Contracts.
 * @returns The Groth16 proof compatible with SnarkJS.
 */
export function unpackGroth16Proof(proof: PackedGroth16Proof): Groth16Proof {
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
