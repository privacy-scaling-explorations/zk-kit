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

/**
 * @prop SnarkArtifacts.wasm
 * @prop SnarkArtifacts.zkey
 * @interface
 */
export type SnarkArtifacts = Record<"wasm" | "zkey", string>

/**
 * Semantic version.
 * @example
 * 1.0.0-beta
 * 2.0.0
 * @example
 * "latest"
 */
export type Version = string | "latest"
