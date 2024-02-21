/**
 * @module Conversions
 * This module provides a collection of utility functions for converting
 * between different numerical formats, particularly focusing on
 * conversions involving bigints, hexadecimals and buffers.
 * The module is structured with clear function naming to indicate
 * the conversion direction (e.g., `bigIntToHexadecimal` for BigInt
 * to hexadecimal, `bufferToBigint` for buffer to bigint) and employs
 * type checks to ensure the correct handling of various input types.
 * It also includes variations for both big-endian (`be`) and little-endian
 * (`le`) conversions. It is important to note that when there is no prefix,
 * the order of bytes is always big-endian.
 */

import { BigNumberish } from "./types"
import { isHexadecimal, isStringifiedBigint } from "./number-checks"

/**
 * Converts a bigint to a hexadecimal string ensuring even length.
 * @param n The bigint value to convert.
 * @returns The hexadecimal representation of the bigint.
 */
export function beBigIntToHexadecimal(n: bigint): string {
    let hex = n.toString(16)

    // Ensure even length.
    if (hex.length % 2 !== 0) {
        hex = `0${hex}`
    }

    return hex
}

/**
 * Converts a bigint to a hexadecimal string. Alias for beBigIntToHexadecimal.
 * @param n The bigint value to convert.
 * @returns The hexadecimal representation of the bigint.
 */
export function bigIntToHexadecimal(n: bigint): string {
    return beBigIntToHexadecimal(n)
}

/**
 * Converts a hexadecimal string to a bigint, ensuring the hex string starts with '0x'.
 * @param hex The hexadecimal string to convert.
 * @returns The bigint representation of the hexadecimal string.
 */
export function beHexadecimalToBigint(hex: string): bigint {
    // Ensure the hex string starts with '0x'.
    const formattedHexString = hex.startsWith("0x") ? hex : `0x${hex}`

    return BigInt(formattedHexString)
}

/**
 * Converts a hexadecimal string to a bigint. Alias for beHexadecimalToBigint.
 * @param hex The hexadecimal string to convert.
 * @returns The bigint representation of the hexadecimal string.
 */
export function hexadecimalToBigint(hex: string): bigint {
    return beHexadecimalToBigint(hex)
}

/**
 * Converts a buffer to a bigint by interpreting the buffer as a hexadecimal string.
 * @param b The buffer to convert.
 * @returns The bigint representation of the buffer's contents.
 */
export function beBufferToBigint(b: Buffer): bigint {
    return BigInt(`0x${b.toString("hex")}`)
}

/**
 * Converts a buffer to a bigint. Alias for beBufferToBigint.
 * @param b - The buffer to convert.
 * @returns The bigint representation of the buffer's contents.
 */
export function bufferToBigint(b: Buffer): bigint {
    return beBufferToBigint(b)
}

/**
 * Converts a bigint to a buffer, assuming big-endian byte order, and fills with zeros if necessary.
 * @param n The bigint to convert.
 * @param length The number of bytes of the buffer to return.
 * @returns The buffer representation of the bigint.
 */
export function beBigintToBuffer(n: bigint, length?: number): Buffer {
    const hex = bigIntToHexadecimal(n)

    // Calculate the minimum buffer length required to represent 'n' in bytes.
    // Each hexadecimal character represents 4 bits, so 2 characters are 1 byte.
    const minLength = Math.ceil(hex.length / 2)

    // Use the provided length or the calculated minimum length, whichever is greater.
    const bufferLength = length ? Math.max(length, minLength) : minLength

    // Allocate buffer of the desired size, filled with zeros.
    const buffer = Buffer.alloc(bufferLength, 0)

    const fromHex = Buffer.from(hex, "hex")
    fromHex.copy(buffer, bufferLength - fromHex.length)

    return buffer
}

/**
 * Converts a bigint to a buffer. Alias for beBigintToBuffer.
 * @param n - The bigint to convert.
 * @returns The buffer representation of the bigint.
 */
export function bigintToBuffer(n: bigint): Buffer {
    return beBigintToBuffer(n)
}

/**
 * Converts a BigNumberish type to a buffer, handling various input types and converting them to bigint first if necessary.
 * @param n The BigNumberish value to convert.
 * @returns The buffer representation of the BigNumberish value.
 */
export function beBigNumberishToBuffer(n: BigNumberish): Buffer {
    if (
        typeof n === "number" ||
        typeof n === "bigint" ||
        (typeof n === "string" && isStringifiedBigint(n)) ||
        (typeof n === "string" && isHexadecimal(n))
    ) {
        return bigintToBuffer(BigInt(n))
    }

    return n as Buffer
}

/**
 * Converts a BigNumberish type to a buffer. Alias for beBigNumberishToBuffer.
 * @param n The BigNumberish value to convert.
 * @returns The buffer representation of the BigNumberish value.
 */
export function bigNumberishToBuffer(n: BigNumberish): Buffer {
    return beBigNumberishToBuffer(n)
}

/**
 * Converts a BigNumberish type to a bigint, handling various input types.
 * @param n The BigNumberish value to convert.
 * @returns The bigint representation of the BigNumberish value.
 */
export function beBigNumberishToBigint(n: BigNumberish): bigint {
    if (
        typeof n === "number" ||
        typeof n === "bigint" ||
        (typeof n === "string" && isStringifiedBigint(n)) ||
        (typeof n === "string" && isHexadecimal(n))
    ) {
        return BigInt(n)
    }

    return bufferToBigint(n as Buffer)
}

/**
 * Converts a BigNumberish type to a bigint. Alias for beBigNumberishToBigint.
 * @param n The BigNumberish value to convert.
 * @returns The bigint representation of the BigNumberish value.
 */
export function bigNumberishToBigint(n: BigNumberish): bigint {
    return beBigNumberishToBigint(n)
}

/**
 * Converts a buffer to a bigint assuming little-endian byte order.
 * @param buffer The buffer to convert.
 * @returns The bigint representation of the buffer's contents in little-endian.
 */
export function leBufferToBigint(buffer: Buffer): bigint {
    return BigInt(`0x${Buffer.from(buffer).reverse().toString("hex")}`)
}

/**
 * Converts a bigint to a buffer, assuming little-endian byte order, and fills with zeros if necessary.
 * @param n The bigint to convert.
 * @param length The number of bytes of the buffer to return.
 * @returns The buffer representation of the bigint in little-endian.
 */
export function leBigintToBuffer(n: bigint, length?: number): Buffer {
    const hex = bigIntToHexadecimal(n)

    // Calculate the minimum buffer length required to represent 'n' in bytes.
    // Each hexadecimal character represents 4 bits, so 2 characters are 1 byte.
    const minLength = Math.ceil(hex.length / 2)

    // Use the provided length or the calculated minimum length, whichever is greater.
    const bufferLength = length ? Math.max(length, minLength) : minLength

    // Allocate buffer of the desired size, filled with zeros.
    const buffer = Buffer.alloc(bufferLength, 0)

    const fromHex = Buffer.from(hex, "hex").reverse()
    fromHex.copy(buffer, 0)

    return buffer
}
