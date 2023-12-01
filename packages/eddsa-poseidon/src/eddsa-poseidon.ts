import { poseidon5 } from "poseidon-lite/poseidon5"
import * as babyjub from "./babyjub"
import blake from "./blake"
import Field1 from "./field1"
import * as scalar from "./scalar"
import * as utils from "./utils"

/**
 * Generates a public key from a given private key using the
 * {@link https://eips.ethereum.org/EIPS/eip-2494|Baby Jubjub} elliptic curve.
 * This function utilizes the Baby Jubjub elliptic curve for cryptographic operations.
 * The private key should be securely stored and managed, and it should never be exposed
 * or transmitted in an unsecured manner.
 *
 * @param {String|Buffer|BigInt} privateKey - The private key used for generating the public key.
 *   This can be a string, buffer, or BigInt representing the private key.
 *
 * @returns {Buffer} The derived public key, formatted as a buffer.
 *
 * @example
 * import { generatePublicKey } from "@zk-kit/eddsa-poseidon"
 *
 * const privateKey = "your_private_key_here"
 *
 * const publicKey = generatePublicKey(privateKey)
 *
 * @throws {Error} Throws an error if the private key is invalid or if any cryptographic
 *   operation fails during the public key generation process.
 */
export function generatePublicKey(privateKey: any) {
    const hash = blake(privateKey)

    const s = utils.leBuff2int(utils.pruneBuffer(hash.slice(0, 32)))

    return babyjub.mulPointEscalar(babyjub.Base8, scalar.shiftRight(s, BigInt(3)))
}

/**
 * Signs a message using the provided private key, employing Poseidon hashing and
 * EdDSA with the Baby Jubjub elliptic curve.
 *
 * @param {String|Buffer|BigInt} privateKey - The private key used to sign the message.
 *   This can be a string, buffer, or BigInt representing the private key.
 * @param {String|Buffer} message - The message to be signed. Can be a string or a buffer.
 *
 * @returns {Object} The signature object, typically containing properties relevant to
 *   EdDSA signatures, such as 'r' and 's' values.
 *
 * @example
 * import { signMessage } from "@zk-kit/eddsa-poseidon"
 *
 * const privateKey = "your_private_key_here"
 * const message = "Your message to sign"
 *
 * const signature = signMessage(privateKey, message)
 *
 * @throws {Error} Throws an error if the private key or message is invalid, if the
 *   Poseidon hash function encounters any issues, or if the EdDSA signing process fails.
 */
export function signMessage(privateKey: any, message: any) {
    const hash = blake(privateKey)

    const sBuff = utils.pruneBuffer(hash.slice(0, 32))
    const s = utils.leBuff2int(sBuff)
    const A = babyjub.mulPointEscalar(babyjub.Base8, scalar.shiftRight(s, BigInt(3)))

    const msgBuff = utils.leInt2Buff(message)

    const rBuff = blake(Buffer.concat([hash.slice(32, 64), msgBuff]))

    const Fr = new Field1(babyjub.subOrder)
    const r = Fr.e(utils.leBuff2int(rBuff))

    const R8 = babyjub.mulPointEscalar(babyjub.Base8, r)
    const hm = poseidon5([R8[0], R8[1], A[0], A[1], message])
    const S = Fr.add(r, Fr.mul(hm, s))

    return {
        R8,
        S
    }
}

export function verifySignature(message: bigint, signature: any, publicKey: any) {
    // if (typeof signature !== "object") return false
    // if (!Array.isArray(signature.R8)) return false
    // if (signature.R8.length !== 2) return false
    // if (!babyjub.inCurve(signature.R8)) return false
    // if (!Array.isArray(A)) return false
    // if (A.length != 2) return false
    // if (!babyJub.inCurve(A)) return false
    // if (signature.S >= babyJub.subOrder) return false

    const hm = poseidon5([signature.R8[0], signature.R8[1], publicKey[0], publicKey[1], message])

    const pLeft = babyjub.mulPointEscalar(babyjub.Base8, signature.S)
    let pRight = babyjub.mulPointEscalar(publicKey, scalar.mul(hm, BigInt(8)))

    pRight = babyjub.addPoint(signature.R8, pRight)

    // It returns true if the points match.
    return babyjub.F.eq(pLeft[0], pRight[0]) && babyjub.F.eq(pLeft[1], pRight[1])
}
