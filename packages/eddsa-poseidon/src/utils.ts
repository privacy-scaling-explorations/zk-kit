import { Point } from "@zk-kit/baby-jubjub"
import {
    BigNumberish,
    bigNumberishToBigInt,
    bigNumberishToBuffer,
    bufferToBigInt,
    isBigNumberish,
    isStringifiedBigint
} from "@zk-kit/utils"
import { Signature } from "./types"

export function pruneBuffer(buff: Buffer): Buffer {
    buff[0] &= 0xf8
    buff[31] &= 0x7f
    buff[31] |= 0x40

    return buff
}

export function isPoint(point: Point): boolean {
    return Array.isArray(point) && point.length === 2 && isStringifiedBigint(point[0]) && isStringifiedBigint(point[1])
}

export function isSignature(signature: Signature): boolean {
    return (
        typeof signature === "object" &&
        Object.prototype.hasOwnProperty.call(signature, "R8") &&
        Object.prototype.hasOwnProperty.call(signature, "S") &&
        isPoint(signature.R8) &&
        isStringifiedBigint(signature.S)
    )
}

export function checkPrivateKey(privateKey: BigNumberish): Buffer {
    if (isBigNumberish(privateKey)) {
        return bigNumberishToBuffer(privateKey)
    }

    if (typeof privateKey !== "string") {
        throw TypeError("Invalid private key type. Supported types: number, bigint, buffer, string.")
    }

    return Buffer.from(privateKey)
}

export function checkMessage(message: BigNumberish): bigint {
    if (isBigNumberish(message)) {
        return bigNumberishToBigInt(message)
    }

    if (typeof message !== "string") {
        throw TypeError("Invalid message type. Supported types: number, bigint, buffer, string.")
    }

    return bufferToBigInt(Buffer.from(message))
}
