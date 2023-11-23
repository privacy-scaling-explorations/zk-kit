import type { NumericString, SignalValueType } from "snarkjs"

export type BigNumberish = NumericString | number | bigint

export type SnarkArtifacts = {
    wasmFilePath: string
    zkeyFilePath: string
}

export type PoseidonProof = {
    scope: NumericString
    hash: NumericString
    nullifier: NumericString
    proof: PackedProof
}

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
