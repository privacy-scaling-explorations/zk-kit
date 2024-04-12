import { base64ToBigInt } from "@zk-kit/utils/conversions"
import { Constants } from "./types"

/**
 * Converts Poseidon base64 constants to bigints.
 * @param C Rounds constants.
 * @param M TxT matrix.
 * @returns An object with all bigint constants.
 */
export default function getConstants(C: string[][], M: string[][]): Constants {
    return {
        C: C.map((l) => l.map(base64ToBigInt)),
        M: M.map((l) => l.map(base64ToBigInt))
    }
}
