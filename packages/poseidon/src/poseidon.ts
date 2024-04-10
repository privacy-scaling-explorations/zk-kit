import poseidon1 from "./poseidon-1"
import poseidon10 from "./poseidon-10"
import poseidon11 from "./poseidon-11"
import poseidon12 from "./poseidon-12"
import poseidon13 from "./poseidon-13"
import poseidon14 from "./poseidon-14"
import poseidon15 from "./poseidon-15"
import poseidon16 from "./poseidon-16"
import poseidon2 from "./poseidon-2"
import poseidon3 from "./poseidon-3"
import poseidon4 from "./poseidon-4"
import poseidon5 from "./poseidon-5"
import poseidon6 from "./poseidon-6"
import poseidon7 from "./poseidon-7"
import poseidon8 from "./poseidon-8"
import poseidon9 from "./poseidon-9"

/**
 * Calculate the poseidon hash of N inputs, where 0 < N < 17.
 * The constants used in this implementation are encoded as base64 strings to save space,
 * and are converted into bigints every time a hash is calculated. When this function is called
 * several times, it may be useful to cache the constants converted to bigints by passing true
 * as a second parameter.
 * @param inputs List of values to be hashed.
 * @param cacheConstants Boolean to allow constants to be cached.
 * @returns The Poseidon hash.
 */
export default function poseidon(inputs: bigint[], cacheConstants = false) {
    switch (inputs.length) {
        case 1:
            return poseidon1(inputs, cacheConstants)
        case 2:
            return poseidon2(inputs, cacheConstants)
        case 3:
            return poseidon3(inputs, cacheConstants)
        case 4:
            return poseidon4(inputs, cacheConstants)
        case 5:
            return poseidon5(inputs, cacheConstants)
        case 6:
            return poseidon6(inputs, cacheConstants)
        case 7:
            return poseidon7(inputs, cacheConstants)
        case 8:
            return poseidon8(inputs, cacheConstants)
        case 9:
            return poseidon9(inputs, cacheConstants)
        case 10:
            return poseidon10(inputs, cacheConstants)
        case 11:
            return poseidon11(inputs, cacheConstants)
        case 12:
            return poseidon12(inputs, cacheConstants)
        case 13:
            return poseidon13(inputs, cacheConstants)
        case 14:
            return poseidon14(inputs, cacheConstants)
        case 15:
            return poseidon15(inputs, cacheConstants)
        case 16:
            return poseidon16(inputs, cacheConstants)
        default:
            throw new Error(`Input length '${inputs.length}' is not supported`)
    }
}
