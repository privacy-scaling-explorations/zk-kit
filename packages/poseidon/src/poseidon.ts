import poseidon1 from "./1"
import poseidon10 from "./10"
import poseidon11 from "./11"
import poseidon12 from "./12"
import poseidon13 from "./13"
import poseidon14 from "./14"
import poseidon15 from "./15"
import poseidon16 from "./16"
import poseidon2 from "./2"
import poseidon3 from "./3"
import poseidon4 from "./4"
import poseidon5 from "./5"
import poseidon6 from "./6"
import poseidon7 from "./7"
import poseidon8 from "./8"
import poseidon9 from "./9"

/**
 * Calculate the poseidon hash of N inputs, where 0 < N < 17.
 * The constants used in this implementation are encoded as base64 strings to save space,
 * and are converted into bigints when this module is imported, to save time when hashes are calculated.
 * @param inputs List of values to be hashed.
 * @param cacheConstants Boolean to allow constants to be cached.
 * @returns The Poseidon hash.
 */
export default function poseidon(inputs: bigint[]) {
    switch (inputs.length) {
        case 1:
            return poseidon1(inputs)
        case 2:
            return poseidon2(inputs)
        case 3:
            return poseidon3(inputs)
        case 4:
            return poseidon4(inputs)
        case 5:
            return poseidon5(inputs)
        case 6:
            return poseidon6(inputs)
        case 7:
            return poseidon7(inputs)
        case 8:
            return poseidon8(inputs)
        case 9:
            return poseidon9(inputs)
        case 10:
            return poseidon10(inputs)
        case 11:
            return poseidon11(inputs)
        case 12:
            return poseidon12(inputs)
        case 13:
            return poseidon13(inputs)
        case 14:
            return poseidon14(inputs)
        case 15:
            return poseidon15(inputs)
        case 16:
            return poseidon16(inputs)
        default:
            throw new Error(`Input length '${inputs.length}' is not supported`)
    }
}
