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

export type SnarkArtifacts = Record<Artifact, string>

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
export type Version = `${Digit}.${Digit}.${Digit}` | "latest"
