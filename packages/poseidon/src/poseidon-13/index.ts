import getConstants from "../getConstants"
import poseidonBasic from "../poseidon-basic"
import { Constants } from "../types"
import { C, M } from "./constants"

let cachedConstants: Constants

/**
 * Calculate the poseidon hash of 13 inputs.
 * The constants used in this implementation are encoded as base64 strings to save space,
 * and are converted into bigints every time a hash is calculated. When this function is called
 * several times, it may be useful to cache the constants converted to bigints by passing true
 * as a second parameter.
 * @param inputs List of values to be hashed.
 * @param cacheConstants Boolean to allow constants to be cached.
 * @returns The Poseidon hash.
 */
export default function poseidon13(inputs: bigint[], cacheConstants = false) {
    if (cacheConstants && !cachedConstants) {
        cachedConstants = getConstants(C, M)
    }

    return poseidonBasic(13, cachedConstants ?? getConstants(C, M))([0n, ...inputs])[0]
}
