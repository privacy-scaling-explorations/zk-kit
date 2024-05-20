import type { NumericString } from "snarkjs"
import { Buffer } from "buffer"

export type BigNumber = bigint | string

export type BigNumberish = BigNumber | number | Buffer | Uint8Array

export type PackedGroth16Proof = [
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString
]
