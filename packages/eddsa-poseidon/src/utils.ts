import { BigNumber, BigNumberish, Point, Signature } from "./types"

export function pruneBuffer(buff: Buffer): Buffer {
    buff[0] &= 0xf8
    buff[31] &= 0x7f
    buff[31] |= 0x40

    return buff
}

function isStringifiedBigint(s: BigNumber | string): boolean {
    try {
        BigInt(s)

        return true
    } catch (e) {
        return false
    }
}

export function isHexadecimal(s: string) {
    return /^(0x|0X)[0-9a-fA-F]+$/.test(s)
}

export function isBigNumberish(value: BigNumberish): boolean {
    return (
        typeof value === "number" ||
        typeof value === "bigint" ||
        (typeof value === "string" && isStringifiedBigint(value)) ||
        (typeof value === "string" && isHexadecimal(value)) ||
        Buffer.isBuffer(value)
    )
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

export function int2hex(n: bigint) {
    let hex = n.toString(16)

    // Ensure even length.
    if (hex.length % 2 !== 0) {
        hex = `0${hex}`
    }

    return hex
}

export function bigNumberish2Buff(value: BigNumberish): Buffer {
    if (
        typeof value === "number" ||
        typeof value === "bigint" ||
        (typeof value === "string" && isStringifiedBigint(value))
    ) {
        const hex = int2hex(BigInt(value))

        return Buffer.from(hex, "hex")
    }

    if (typeof value === "string" && isHexadecimal(value)) {
        value = Buffer.from(value.slice(2), "hex")
    }

    return value as Buffer
}

export function buff2int(buffer: Buffer): bigint {
    return BigInt(`0x${buffer.toString("hex")}`)
}

export function bigNumberish2BigNumber(value: BigNumberish): bigint {
    if (
        typeof value === "number" ||
        typeof value === "bigint" ||
        (typeof value === "string" && isStringifiedBigint(value)) ||
        (typeof value === "string" && isHexadecimal(value))
    ) {
        return BigInt(value)
    }

    return buff2int(value as Buffer)
}

export function leBuff2int(buffer: Buffer): bigint {
    return BigInt(`0x${buffer.reverse().toString("hex")}`)
}

export function leInt2Buff(n: bigint): Buffer {
    const hex = int2hex(n)

    // Allocate buffer of the desired size, filled with zeros.
    const buffer = Buffer.alloc(32, 0)

    Buffer.from(hex, "hex").reverse().copy(buffer)

    return buffer
}
