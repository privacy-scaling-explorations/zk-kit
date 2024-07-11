import { Point } from "@zk-kit/baby-jubjub"
import type { BigNumberish } from "@zk-kit/utils"
import { bigNumberishToBigInt, bufferToBigInt } from "@zk-kit/utils/conversions"
import { requireTypes } from "@zk-kit/utils/error-handlers"
import { isArray, isBigNumber, isBigNumberish, isObject } from "@zk-kit/utils/type-checks"
import { Buffer } from "buffer"
import { Blake512 } from "./blake"
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
    return isArray(point) && point.length === 2 && isBigNumber(point[0]) && isBigNumber(point[1])
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
        isBigNumber(signature.S)
    )
}

/**
 * Validates and converts a BigNumberish private key to a Buffer.
 * @param privateKey The private key to check and convert.
 * @returns The private key as a Buffer.
 */
export function checkPrivateKey(privateKey: Buffer | Uint8Array | string): Buffer {
    requireTypes(privateKey, "privateKey", ["Buffer", "Uint8Array", "string"])

    return Buffer.from(privateKey)
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

/**
 * Computes the Blake512 hash of the input message.
 * Blake512 is a cryptographic hash function that produces a hash value of 512 bits,
 * commonly used for data integrity checks and other cryptographic applications.
 * @param message The input data to hash, provided as a Buffer.
 * @returns A Buffer containing the 512-bit hash result.
 */
export function hash(message: Buffer | Uint8Array): Buffer {
    const engine = new Blake512()

    engine.update(Buffer.from(message))

    return engine.digest()
}
