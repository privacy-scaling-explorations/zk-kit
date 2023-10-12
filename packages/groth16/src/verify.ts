/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/naming-convention */
/* istanbul ignore file */

import { Scalar, utils, buildBn128 } from "ffjavascript"
import { Groth16Proof, PublicSignals } from "./types"

const { unstringifyBigInts } = utils

function isWellConstructed(curve: any, proof: any) {
    const { G1 } = curve
    const { G2 } = curve

    return G1.isValid(proof.pi_a) && G2.isValid(proof.pi_b) && G1.isValid(proof.pi_c)
}

function publicInputsAreValid(curve: any, publicInputs: any) {
    for (let i = 0; i < publicInputs.length; i++) {
        if (!Scalar.lt(publicInputs[i], curve.r)) {
            return false
        }
    }
    return true
}

/**
 * Verifies if a Groth16 proof is valid or not.
 * @param verificationKey The verification key used to verify the proof.
 * @param proof The proof containing public signals and zero-knowledge parameters.
 * @returns True if the proof is valid, and false otherwise.
 */
export default async function verify(
    verificationKey: any,
    {
        proof,
        publicSignals
    }: {
        proof: Groth16Proof
        publicSignals: PublicSignals
    }
): Promise<boolean> {
    verificationKey = unstringifyBigInts(verificationKey)
    proof = unstringifyBigInts(proof)
    publicSignals = unstringifyBigInts(publicSignals)

    // @ts-ignore
    const curve = globalThis.curve_bn128 ?? (await buildBn128(undefined, undefined))

    const IC0 = curve.G1.fromObject(verificationKey.IC[0])
    const IC = new Uint8Array(curve.G1.F.n8 * 2 * publicSignals.length)
    const w = new Uint8Array(curve.Fr.n8 * publicSignals.length)

    if (!publicInputsAreValid(curve, publicSignals)) {
        return false
    }

    for (let i = 0; i < publicSignals.length; i++) {
        const buffP = curve.G1.fromObject(verificationKey.IC[i + 1])
        IC.set(buffP, i * curve.G1.F.n8 * 2)
        Scalar.toRprLE(w, curve.Fr.n8 * i, publicSignals[i], curve.Fr.n8)
    }

    let cpub = await curve.G1.multiExpAffine(IC, w)
    cpub = curve.G1.add(cpub, IC0)

    const pi_a = curve.G1.fromObject(proof.pi_a)
    const pi_b = curve.G2.fromObject(proof.pi_b)
    const pi_c = curve.G1.fromObject(proof.pi_c)

    if (!isWellConstructed(curve, { pi_a, pi_b, pi_c })) {
        return false
    }

    const vk_gamma_2 = curve.G2.fromObject(verificationKey.vk_gamma_2)
    const vk_delta_2 = curve.G2.fromObject(verificationKey.vk_delta_2)
    const vk_alpha_1 = curve.G1.fromObject(verificationKey.vk_alpha_1)
    const vk_beta_2 = curve.G2.fromObject(verificationKey.vk_beta_2)

    return curve.pairingEq(
        curve.G1.neg(pi_a),
        pi_b,
        cpub,
        vk_gamma_2,
        pi_c,
        vk_delta_2,

        vk_alpha_1,
        vk_beta_2
    )
}
