/**
 * @module ProofPacking
 *
 * This module provides utility functions to pack and unpack
 * various types of objects, making it easier to export or use
 * them externally.
 */

import type { Groth16Proof, PlonkProof } from "snarkjs"
import { PackedGroth16Proof, PackedPlonkProof } from "./types"

/**
 * Packs a Snarkjs Groth16 proof into a single list usable as calldata in Solidity (public signals are not included).
 * @param proof The Groth16 proof generated with SnarkJS.
 * @returns Solidity calldata.
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
 * Unpacks a PackedGroth16Proof Solidity calldata into its original form which is a SnarkJS Groth16 proof.
 * @param proof Solidity calldata.
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

/**
 * Packs a Snarkjs Plonk proof into a single list usable as calldata in Solidity (public signals are not included).
 * @param proof The Plonk proof generated with SnarkJS.
 * @returns Solidity calldata.
 */
export function packPlonkProof(proof: PlonkProof): PackedPlonkProof {
    return [
        proof.A[0],
        proof.A[1],
        proof.B[0],
        proof.B[1],
        proof.C[0],
        proof.C[1],
        proof.Z[0],
        proof.Z[1],
        proof.T1[0],
        proof.T1[1],
        proof.T2[0],
        proof.T2[1],
        proof.T3[0],
        proof.T3[1],
        proof.Wxi[0],
        proof.Wxi[1],
        proof.Wxiw[0],
        proof.Wxiw[1],
        proof.eval_a,
        proof.eval_b,
        proof.eval_c,
        proof.eval_s1,
        proof.eval_s2,
        proof.eval_zw
    ]
}

/**
 * Unpacks a PackedPlonkProof Solidity calldata into its original form which is a SnarkJS Plonk proof.
 * @param proof Solidity calldata.
 * @returns The Plonk proof compatible with SnarkJS.
 */
export function unpackPlonkProof(proof: PackedPlonkProof): PlonkProof {
    return {
        A: [proof[0], proof[1]],
        B: [proof[2], proof[3]],
        C: [proof[4], proof[5]],
        Z: [proof[6], proof[7]],
        T1: [proof[8], proof[9]],
        T2: [proof[10], proof[11]],
        T3: [proof[12], proof[13]],
        Wxi: [proof[14], proof[15]],
        Wxiw: [proof[16], proof[17]],
        eval_a: proof[18],
        eval_b: proof[19],
        eval_c: proof[20],
        eval_s1: proof[21],
        eval_s2: proof[22],
        eval_zw: proof[23],
        protocol: "plonk",
        curve: "bn128"
    }
}
