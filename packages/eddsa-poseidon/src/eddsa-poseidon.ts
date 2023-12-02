import { poseidon5 } from "poseidon-lite/poseidon5"
import * as babyjub from "./babyjub"
import blake from "./blake"
import Field1 from "./field1"
import * as scalar from "./scalar"
import { BigNumberish, Point, Signature } from "./types"
import * as utils from "./utils"

/**
 * Derives a public key from a given private key using the
 * {@link https://eips.ethereum.org/EIPS/eip-2494|Baby Jubjub} elliptic curve.
 * This function utilizes the Baby Jubjub elliptic curve for cryptographic operations.
 * The private key should be securely stored and managed, and it should never be exposed
 * or transmitted in an unsecured manner.
 * @param privateKey - The private key used for generating the public key.
 * @returns The derived public key.
 */
export function derivePublicKey(privateKey: BigNumberish): Point<string> {
    // Convert the private key to buffer.
    privateKey = utils.checkPrivateKey(privateKey)

    const hash = blake(privateKey)

    const s = utils.leBuff2int(utils.pruneBuffer(hash.slice(0, 32)))

    const publicKey = babyjub.mulPointEscalar(babyjub.Base8, scalar.shiftRight(s, BigInt(3)))

    // Convert the public key values to strings so that it can easily be exported as a JSON.
    return [publicKey[0].toString(), publicKey[1].toString()]
}

/**
 * Signs a message using the provided private key, employing Poseidon hashing and
 * EdDSA with the Baby Jubjub elliptic curve.
 * @param privateKey - The private key used to sign the message.
 * @param message - The message to be signed.
 * @returns The signature object, containing properties relevant to EdDSA signatures, such as 'R8' and 'S' values.
 */
export function signMessage(privateKey: BigNumberish, message: BigNumberish): Signature<string> {
    // Convert the private key to buffer.
    privateKey = utils.checkPrivateKey(privateKey)

    // Convert the message to big integer.
    message = utils.checkMessage(message)

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

    // Convert the signature values to strings so that it can easily be exported as a JSON.
    return {
        R8: [R8[0].toString(), R8[1].toString()],
        S: S.toString()
    }
}

/**
 * Verifies an EdDSA signature using the Baby Jubjub elliptic curve and Poseidon hash function.
 * @param message - The original message that was be signed.
 * @param signature - The EdDSA signature to be verified.
 * @param publicKey - The public key associated with the private key used to sign the message.
 * @returns Returns true if the signature is valid and corresponds to the message and public key, false otherwise.
 */
export function verifySignature(message: BigNumberish, signature: Signature, publicKey: Point): boolean {
    if (
        !utils.isPoint(publicKey) ||
        !utils.isSignature(signature) ||
        !babyjub.inCurve(signature.R8) ||
        !babyjub.inCurve(publicKey) ||
        BigInt(signature.S) >= babyjub.subOrder
    ) {
        return false
    }

    // Convert the message to big integer.
    message = utils.checkMessage(message)

    // Convert the signature values to big integers for calculations.
    const _signature: Signature<bigint> = {
        R8: [BigInt(signature.R8[0]), BigInt(signature.R8[1])],
        S: BigInt(signature.S)
    }
    // Convert the public key values to big integers for calculations.
    const _publicKey: Point<bigint> = [BigInt(publicKey[0]), BigInt(publicKey[1])]

    const hm = poseidon5([signature.R8[0], signature.R8[1], publicKey[0], publicKey[1], message])

    const pLeft = babyjub.mulPointEscalar(babyjub.Base8, BigInt(signature.S))
    let pRight = babyjub.mulPointEscalar(_publicKey, scalar.mul(hm, BigInt(8)))

    pRight = babyjub.addPoint(_signature.R8, pRight)

    // Return true if the points match.
    return babyjub.F.eq(BigInt(pLeft[0]), pRight[0]) && babyjub.F.eq(pLeft[1], pRight[1])
}
