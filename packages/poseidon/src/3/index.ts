import getConstants from "../getConstants"
import poseidonBasic from "../poseidon-basic"
import { C, M } from "./constants"

const instance = poseidonBasic(3, getConstants(C, M))

/**
 * Calculate the poseidon hash of 3 inputs.
 * The constants used in this implementation are encoded as base64 strings to save space,
 * and are converted into bigints when this module is imported, to save time when hashes are calculated.
 * @param inputs List of values to be hashed.
 * @param cacheConstants Boolean to allow constants to be cached.
 * @returns The Poseidon hash.
 */
export default function poseidon(inputs: (bigint | string | number)[]) {
    return instance([0n, ...inputs.map(BigInt)])[0]
}
