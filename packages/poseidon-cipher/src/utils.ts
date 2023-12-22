// https://github.com/weijiekoh/circomlib/blob/feat/poseidon-encryption/
// all credits for this implementation go to https://github.com/weijiekoh

import { Fr, r } from "@zk-kit/baby-jubjub"

import { C, M, N_ROUNDS_F, N_ROUNDS_P, two128 } from "./constants"
import { Nonce } from "./types"

/**
 * Given a bigint a, returns a^5.
 * @param a the value to exponentiate
 * @returns the result of a^5
 */
export const pow5 = (a: bigint): bigint => Fr.mul(a, Fr.square(Fr.square(a)))

/**
 * Given a bigint a, returns a normalized value of a.
 * @dev r is 'r' is the alt_bn128 prime order, so we can use it to normalize values
 * @param a the value to normalize
 * @returns the normalized value of a
 */
export const normalize = (a: bigint): bigint => {
    if (a < 0) {
        let na = -a
        if (na >= r) na %= r
        return r - na
    } 
    return a >= r ? a % r : a
}

/**
 * Apply the Poseidon permutation to the given inputs
 * @param inputs - the inputs to the permutation
 * @returns an array of bigint representing the output of the permutation
 */
export const poseidonPerm = (inputs: bigint[]): bigint[] => {
    if (inputs.length === 0) throw new Error("Input length must be positive")
    if (inputs.length >= N_ROUNDS_P.length) throw new Error("Input length too large")

    const t = inputs.length
    const nRoundsF = N_ROUNDS_F
    const nRoundsP = N_ROUNDS_P[t - 2]

    let state = inputs.map((a) => Fr.e(a))
    for (let r = 0; r < nRoundsF + nRoundsP; r += 1) {
        state = state.map((a, i) => Fr.add(a, C[t - 2][r * t + i]))

        if (r < nRoundsF / 2 || r >= nRoundsF / 2 + nRoundsP) {
            state = state.map((a) => pow5(a))
        } else {
            state[0] = pow5(state[0])
        }

        state = state.map((_, i) => state.reduce((acc, a, j) => Fr.add(acc, Fr.mul(M[t - 2][i][j], a)), Fr.zero))
    }
    return state.map((x) => normalize(x))
}

/**
 * Check if two field values are equal
 * @param a the first value
 * @param b the second value
 * @param error the error to throw if the values are not equal
 */
export const checkEqual = (a: bigint, b: bigint, error: string): void => {
    if (!Fr.eq(a, b)) throw new Error(error)
}

/**
 * Validate that the nonce is less than 2 ^ 128 (sqrt of the field size)
 * @param nonce the nonce to validate
 */
export const validateNonce = (nonce: Nonce<bigint>): void => {
    if (nonce >= two128) throw new Error("The nonce must be less than 2 ^ 128")
}
