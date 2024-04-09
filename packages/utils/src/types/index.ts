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

export enum ProofType {
    POSEIDON = "poseidon",
    EDDSA = "eddsa"
}

export enum ArtifactType {
    WASM = "wasm",
    ZKEY = "zkey"
}

export type SnarkArtifacts = {
    wasmFilePath: string
    zkeyFilePath: string
}

export type RequiredInputs<T> = T extends ProofType.POSEIDON ? number : never
