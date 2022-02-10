import { BigNumber } from "@ethersproject/bignumber"
import { randomBytes } from "@ethersproject/random"
import { sha256 as _sha256 } from "js-sha256"

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
  return BigNumber.from(randomBytes(numberOfBytes)).toBigInt()
}
