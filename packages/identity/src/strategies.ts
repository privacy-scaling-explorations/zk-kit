import * as crypto from "crypto"
import * as bigintConversion from "bigint-conversion"
import { sha256 as _sha256 } from "js-sha256"
import { Identity } from "@libsem/types"

const genRandomNumber = (numBytes = 31): bigint => {
  return bigintConversion.bufToBigint(crypto.randomBytes(numBytes))
}

/**
 *
 * @returns Identity
 */
const genRandomIdentity = (): Identity => {
  return {
    identityNullifier: genRandomNumber(31),
    identityTrapdoor: genRandomNumber(31)
  }
}

/**
 *
 * @param metadata { signedMessage } from which to create identity
 * @returns Identity
 */
const genIdentityFromMessage = (message: string): Identity => {
  const sha256 = (message: string): string => {
    const hash = _sha256.create()
    hash.update(message)
    return hash.hex()
  }

  const messageHash = sha256(message)
  const identityNullifier = bigintConversion.hexToBigint(sha256(`${messageHash}identity_nullifier`))
  const identityTrapdoor = bigintConversion.hexToBigint(sha256(`${messageHash}identity_trapdoor`))

  return {
    identityTrapdoor,
    identityNullifier
  }
}

export { genRandomIdentity, genIdentityFromMessage, genRandomNumber }
