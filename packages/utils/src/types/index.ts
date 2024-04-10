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

export enum Proof {
    EDDSA = "eddsa",
    POSEIDON = "poseidon",
    SEMAPHORE = "semaphore"
}

export enum Artifact {
    WASM = "wasm",
    ZKEY = "zkey"
}

export type SnarkArtifacts = {
    wasmFilePath: string
    zkeyFilePath: string
}
