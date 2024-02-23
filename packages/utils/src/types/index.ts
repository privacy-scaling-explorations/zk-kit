import { NumericString } from "snarkjs"

export type BigNumber = bigint | string

export type BigNumberish = BigNumber | number | Buffer

export type PackedProof = [
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString,
    NumericString
]
