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
 * Supported proof types:
 * {@link @zk-kit/eddsa-proof!generate | EdDSA}
 * {@link @zk-kit/poseidon-proof!generate | Poseidon}
 * {@link https://github.com/semaphore-protocol/semaphore/tree/main/packages/proof | Semaphore}.
 * @enum
 */
export enum Proof {
    EDDSA = "eddsa",
    POSEIDON = "poseidon",
    SEMAPHORE = "semaphore"
}

/**
 * Circom Snark Artifact file extensions.
 * @enum
 */
export enum Artifact {
    WASM = "wasm",
    ZKEY = "zkey"
}

/**
 * @prop Artifact.WASM
 * @prop Artifact.ZKEY
 * @interface
 */
export type SnarkArtifacts = Record<Artifact, string>

/**
 * @internal
 */
export type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

/**
 * Semantic version.
 * @example
 * 1.0.0
 * @example
 * "latest"
 */
export type Version = `${Digit}.${Digit}.${Digit}` | "latest"
