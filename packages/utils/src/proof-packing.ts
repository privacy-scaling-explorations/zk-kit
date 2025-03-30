/**
 * @module ProofPacking
 *
 * This module provides utility functions to pack and unpack
 * various types of objects, making it easier to export or use
 * them externally.
 */

import type { Groth16Proof, PlonkProof, FflonkProof } from "snarkjs"
import { zeroPadValue, toBeHex, toBigInt } from "ethers/utils"
import { PackedGroth16Proof, PackedPlonkProof, PackedFflonkProof } from "./types"

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

/**
 * Packs a Snarkjs Fflonk proof into a single list usable as calldata in Solidity (public signals are not included).
 * @param proof The Fflonk proof generated with SnarkJS.
 * @returns Solidity calldata.
 */
export function packFflonkProof(proof: FflonkProof): PackedFflonkProof {
    return [
        zeroPadValue(toBeHex(toBigInt(proof.polynomials.C1[0])), 32),
        zeroPadValue(toBeHex(toBigInt(proof.polynomials.C1[1])), 32),
        zeroPadValue(toBeHex(toBigInt(proof.polynomials.C2[0])), 32),
        zeroPadValue(toBeHex(toBigInt(proof.polynomials.C2[1])), 32),
        zeroPadValue(toBeHex(toBigInt(proof.polynomials.W1[0])), 32),
        zeroPadValue(toBeHex(toBigInt(proof.polynomials.W1[1])), 32),
        zeroPadValue(toBeHex(toBigInt(proof.polynomials.W2[0])), 32),
        zeroPadValue(toBeHex(toBigInt(proof.polynomials.W2[1])), 32),
        zeroPadValue(toBeHex(toBigInt(proof.evaluations.ql)), 32),
        zeroPadValue(toBeHex(toBigInt(proof.evaluations.qr)), 32),
        zeroPadValue(toBeHex(toBigInt(proof.evaluations.qm)), 32),
        zeroPadValue(toBeHex(toBigInt(proof.evaluations.qo)), 32),
        zeroPadValue(toBeHex(toBigInt(proof.evaluations.qc)), 32),
        zeroPadValue(toBeHex(toBigInt(proof.evaluations.s1)), 32),
        zeroPadValue(toBeHex(toBigInt(proof.evaluations.s2)), 32),
        zeroPadValue(toBeHex(toBigInt(proof.evaluations.s3)), 32),
        zeroPadValue(toBeHex(toBigInt(proof.evaluations.a)), 32),
        zeroPadValue(toBeHex(toBigInt(proof.evaluations.b)), 32),
        zeroPadValue(toBeHex(toBigInt(proof.evaluations.c)), 32),
        zeroPadValue(toBeHex(toBigInt(proof.evaluations.z)), 32),
        zeroPadValue(toBeHex(toBigInt(proof.evaluations.zw)), 32),
        zeroPadValue(toBeHex(toBigInt(proof.evaluations.t1w)), 32),
        zeroPadValue(toBeHex(toBigInt(proof.evaluations.t2w)), 32),
        zeroPadValue(toBeHex(toBigInt(proof.evaluations.inv)), 32)
    ]
}

/**
 * Unpacks a PackedFflonkProof Solidity calldata into its original form which is a SnarkJS Fflonk proof.
 * @param proof Solidity calldata.
 * @returns The Fflonk proof compatible with SnarkJS.
 */
export function unpackFflonkProof(proof: PackedFflonkProof): FflonkProof {
    return {
        polynomials: {
            C1: [toBigInt(proof[0]).toString(), toBigInt(proof[1]).toString()],
            C2: [toBigInt(proof[2]).toString(), toBigInt(proof[3]).toString()],
            W1: [toBigInt(proof[4]).toString(), toBigInt(proof[5]).toString()],
            W2: [toBigInt(proof[6]).toString(), toBigInt(proof[7]).toString()]
        },
        evaluations: {
            ql: toBigInt(proof[8]).toString(),
            qr: toBigInt(proof[9]).toString(),
            qm: toBigInt(proof[10]).toString(),
            qo: toBigInt(proof[11]).toString(),
            qc: toBigInt(proof[12]).toString(),
            s1: toBigInt(proof[13]).toString(),
            s2: toBigInt(proof[14]).toString(),
            s3: toBigInt(proof[15]).toString(),
            a: toBigInt(proof[16]).toString(),
            b: toBigInt(proof[17]).toString(),
            c: toBigInt(proof[18]).toString(),
            z: toBigInt(proof[19]).toString(),
            zw: toBigInt(proof[20]).toString(),
            t1w: toBigInt(proof[21]).toString(),
            t2w: toBigInt(proof[22]).toString(),
            inv: toBigInt(proof[23]).toString()
        },
        protocol: "fflonk",
        curve: "bn128"
    }
}
