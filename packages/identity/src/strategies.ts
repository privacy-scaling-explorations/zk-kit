import { Identity } from "@zk-kit/types"
import { hexToBigint } from "bigint-conversion"
import { genRandomNumber, sha256 } from "./utils"

export enum Strategy {
  RANDOM,
  MESSAGE,
  SERIALIZED
}

/**
 * Generates a random identity.
 * @returns Identity The generated identity.
 */
export function genRandomIdentity(): Identity {
  return {
    identityNullifier: genRandomNumber(),
    identityTrapdoor: genRandomNumber()
  }
}

/**
 * Generate an deterministic identity from an external message.
 * @param message The message from which to create identity.
 * @returns Identity The generated identity.
 */
export function genIdentityFromMessage(message: string): Identity {
  const messageHash = sha256(message)

  return {
    identityNullifier: hexToBigint(sha256(`${messageHash}identity_nullifier`)),
    identityTrapdoor: hexToBigint(sha256(`${messageHash}identity_trapdoor`))
  }
}
