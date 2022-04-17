import { BigNumber } from "@ethersproject/bignumber"
import { randomBytes } from "@ethersproject/random"
import _sha256 from "crypto-js/sha256"

/**
 * Returns an hexadecimal sha256 hash of the message passed as parameter.
 * @param message The string to hash.
 * @returns The hexadecimal hash of the message.
 */
export function sha256(message: string): string {
  const hash = _sha256(message)

  return hash.toString()
}

/**
 * Generates a random big number.
 * @param numberOfBytes The number of bytes of the number.
 * @returns The generated random number.
 */
export function genRandomNumber(numberOfBytes = 31): bigint {
  return BigNumber.from(randomBytes(numberOfBytes)).toBigInt()
}
