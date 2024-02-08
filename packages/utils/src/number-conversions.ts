import { BigNumberish } from "./types"
import { isHexadecimal, isStringifiedBigint } from "./number-checks"

export function bigintToHexadecimal(n: bigint) {
    let hex = n.toString(16)

    // Ensure even length.
    if (hex.length % 2 !== 0) {
        hex = `0${hex}`
    }

    return hex
}

export function bigNumberishToBuffer(value: BigNumberish): Buffer {
    if (
        typeof value === "number" ||
        typeof value === "bigint" ||
        (typeof value === "string" && isStringifiedBigint(value))
    ) {
        const hex = bigintToHexadecimal(BigInt(value))

        return Buffer.from(hex, "hex")
    }

    return value as Buffer
}

export function bufferToBigint(buffer: Buffer): bigint {
    return BigInt(`0x${buffer.toString("hex")}`)
}

export function bigintToBuffer(n: bigint): Buffer {
    const hex = bigintToHexadecimal(n)

    // Allocate buffer of the desired size, filled with zeros.
    const buffer = Buffer.alloc(32, 0)

    const fromHex = Buffer.from(hex, "hex")
    fromHex.copy(buffer, 32 - fromHex.length)

    return buffer
}

export function bigNumberishToBigint(value: BigNumberish): bigint {
    if (
        typeof value === "number" ||
        typeof value === "bigint" ||
        (typeof value === "string" && isStringifiedBigint(value)) ||
        (typeof value === "string" && isHexadecimal(value))
    ) {
        return BigInt(value)
    }

    return bufferToBigint(value as Buffer)
}

export function leBufferToBigint(buffer: Buffer): bigint {
    return BigInt(`0x${Buffer.from(buffer).reverse().toString("hex")}`)
}

export function leBigintToBuffer(n: bigint): Buffer {
    const hex = bigintToHexadecimal(n)

    // Allocate buffer of the desired size, filled with zeros.
    const buffer = Buffer.alloc(32, 0)

    const fromHex = Buffer.from(hex, "hex").reverse()
    fromHex.copy(buffer, 0)

    return buffer
}
