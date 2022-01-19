import { randomBytes } from "@ethersproject/random"
import { SerializedIdentity } from "@zk-kit/types"
import { bufToBigint } from "bigint-conversion"
import { ZqField } from "ffjavascript"
import { sha256 as _sha256 } from "js-sha256"

const SNARK_FIELD_SIZE = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617")

export const Fq = new ZqField(SNARK_FIELD_SIZE)

/**
 * Returns an hexadecimal sha256 hash of the message passed as parameter.
 * @param message The string to hash.
 * @returns The hexadecimal hash of the message.
 */
export function sha256(message: string): string {
  const hash = _sha256.create()

  hash.update(message)

  return hash.hex()
}

/**
 * Generates a random big number.
 * @param numberOfBytes The number of bytes of the number.
 * @returns The generated random number.
 */
export function genRandomNumber(numberOfBytes = 31): bigint {
  return bufToBigint(randomBytes(numberOfBytes))
}

/**
 * Parses a string containing the serialized identity parameters.
 * @param serializedIdentity The serialized identity string.
 * @returns The serialized identity parameters.
 */
export function parseSerializedIdentity(serializedIdentity: string): SerializedIdentity {
  const data = JSON.parse(serializedIdentity)

  if (
    !("identityNullifier" in data) ||
    !("identityTrapdoor" in data) ||
    !("secret" in data) ||
    !("multipartSecret" in data)
  ) {
    throw new Error("Wrong input identity")
  }

  return data
}
