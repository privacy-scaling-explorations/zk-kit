import { Point } from "@zk-kit/baby-jubjub"
import { requireTypes, type BigNumberish, isBigNumberish } from "@zk-kit/utils"
import { bigNumberishToBigInt, bigNumberishToBuffer, bufferToBigInt } from "@zk-kit/utils/conversions"
import { requireBigNumberish } from "@zk-kit/utils/error-handlers"
import { isArray, isObject, isStringifiedBigInt } from "@zk-kit/utils/type-checks"
import { Signature } from "./types"

/**
 * Prunes a buffer to meet the specific requirements for using it as a private key
 * or part of a signature.
 * @param buff The buffer to be pruned.
 * @returns The pruned buffer.
 */
export function pruneBuffer(buff: Buffer): Buffer {
    buff[0] &= 0xf8
    buff[31] &= 0x7f
    buff[31] |= 0x40

    return buff
}

/**
 * Validates if the given object is a valid point on the Baby Jubjub elliptic curve.
 * @param point The point to validate.
 * @returns True if the object is a valid point, false otherwise.
 */
export function isPoint(point: Point): boolean {
    return isArray(point) && point.length === 2 && isStringifiedBigInt(point[0]) && isStringifiedBigInt(point[1])
}

/**
 * Checks if the provided object conforms to the expected format of a Signature.
 * @param signature The signature to validate.
 * @returns True if the object is a valid Signature, false otherwise.
 */
export function isSignature(signature: Signature): boolean {
    return (
        isObject(signature) &&
        Object.prototype.hasOwnProperty.call(signature, "R8") &&
        Object.prototype.hasOwnProperty.call(signature, "S") &&
        isPoint(signature.R8) &&
        isStringifiedBigInt(signature.S)
    )
}

/**
 * Validates and converts a BigNumberish private key to a Buffer.
 * @param privateKey The private key to check and convert.
 * @returns The private key as a Buffer.
 */
export function checkPrivateKey(privateKey: BigNumberish): Buffer {
    requireTypes(privateKey, "privateKey", ["bignumberish", "string"])

    if (isBigNumberish(privateKey)) {
        return bigNumberishToBuffer(privateKey)
    }

    return Buffer.from(privateKey as string)
}

/**
 * Validates and converts a BigNumberish message to a bigint.
 * @param message The message to check and convert.
 * @returns The message as a bigint.
 */
export function checkMessage(message: BigNumberish): bigint {
    requireTypes(message, "message", ["bignumberish", "string"])

    if (isBigNumberish(message)) {
        return bigNumberishToBigInt(message)
    }

    return bufferToBigInt(Buffer.from(message as string))
}
