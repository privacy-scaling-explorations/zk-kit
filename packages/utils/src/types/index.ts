import { NumericString } from "snarkjs"

export type BigNumber = bigint | string

export type BigNumberish = BigNumber | number | Buffer

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
