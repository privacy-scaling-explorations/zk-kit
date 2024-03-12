/**
 * @module Conversions
 * This module provides a collection of utility functions for converting
 * between different numerical formats, particularly focusing on
 * conversions involving bigints, hexadecimals and buffers.
 * The module is structured with clear function naming to indicate
 * the conversion direction (e.g., `bigIntToHexadecimal` for BigInt
 * to hexadecimal, `bufferToBigInt` for buffer to bigint) and employs
 * type checks to ensure the correct handling of various input types.
 * It also includes variations for both big-endian (`be`) and little-endian
 * (`le`) conversions. It is important to note that when there is no prefix,
 * the order of bytes is always big-endian.
 */

import { Buffer } from "buffer"
import { requireHexadecimal, requireTypes } from "./error-handlers"
import { isBigInt, isBuffer, isHexadecimal, isNumber, isStringifiedBigInt } from "./type-checks"
import { BigNumber, BigNumberish } from "./types"

/**
 * Converts a bigint to a hexadecimal string.
 * @param n The bigint value to convert.
 * @returns The hexadecimal representation of the bigint.
 */
export function bigIntToHexadecimal(n: bigint): string {
    let hex = n.toString(16)

    // Ensure even length.
    if (hex.length % 2 !== 0) {
        hex = `0${hex}`
    }

    return hex
}

/**
 * Converts a hexadecimal string to a bigint. The input is interpreted as hexadecimal
 * with or without a '0x' prefix. It uses big-endian byte order.
 * @param hex The hexadecimal string to convert.
 * @returns The bigint representation of the hexadecimal string.
 */
export function beHexadecimalToBigInt(hex: string): bigint {
    // Ensure the hex string starts with '0x'.
    const formattedHexString = hex.startsWith("0x") ? hex : `0x${hex}`

    return BigInt(formattedHexString)
}

/**
 * Converts a hexadecimal string to a bigint. Alias for beHexadecimalToBigInt.
 * @param hex The hexadecimal string to convert.
 * @returns The bigint representation of the hexadecimal string.
 */
export function hexadecimalToBigInt(hex: string): bigint {
    return beHexadecimalToBigInt(hex)
}

/**
 * Converts a buffer of bytes to a bigint using big-endian byte order.
 * @param b The buffer to convert.
 * @returns The bigint representation of the buffer's contents.
 */
export function beBufferToBigInt(b: Buffer): bigint {
    return BigInt(`0x${b.toString("hex")}`)
}

/**
 * Converts a buffer to a bigint using little-endian byte order.
 * @param buffer The buffer to convert.
 * @returns The bigint representation of the buffer's contents in little-endian.
 */
export function leBufferToBigInt(buffer: Buffer): bigint {
    return BigInt(`0x${Buffer.from(buffer).reverse().toString("hex")}`)
}

/**
 * Converts a buffer to a bigint. Alias for beBufferToBigInt.
 * @param b The buffer to convert.
 * @returns The bigint representation of the buffer's contents.
 */
export function bufferToBigInt(b: Buffer): bigint {
    return beBufferToBigInt(b)
}

/**
 * Converts a bigint to a buffer and fills with zeros if a valid
 * size (i.e. number of bytes) is specified. If the size is not defined,
 * it gets the size from the given bigint. If the specified size is smaller than
 * the size of the bigint (i.e. `minSize`), an error is thrown.
 * It uses big-endian byte order.
 * @param n The bigint to convert.
 * @param size The number of bytes of the buffer to return.
 * @returns The buffer representation of the bigint.
 */
export function beBigIntToBuffer(n: bigint, size?: number): Buffer {
    const hex = bigIntToHexadecimal(n)

    // Calculate the minimum buffer size required to represent 'n' in bytes.
    // Each hexadecimal character represents 4 bits, so 2 characters are 1 byte.
    const minSize = Math.ceil(hex.length / 2)

    if (!size) {
        size = minSize
    } else if (size < minSize) {
        throw Error(`Size ${size} is too small, need at least ${minSize} bytes`)
    }

    // Allocate buffer of the desired size, filled with zeros.
    const buffer = Buffer.alloc(size, 0)

    const fromHex = Buffer.from(hex, "hex")
    fromHex.copy(buffer, size - fromHex.length)

    return buffer
}

/**
 * Converts a bigint to a buffer and fills with zeros if a valid
 * size (i.e. number of bytes) is specified. If the size is not defined,
 * it gets the size from the given bigint. If the specified size is smaller than
 * the size of the bigint (i.e. `minSize`), an error is thrown.
 * It uses little-endian byte order.
 * @param n The bigint to convert.
 * @param size The number of bytes of the buffer to return.
 * @returns The buffer representation of the bigint in little-endian.
 */
export function leBigIntToBuffer(n: bigint, size?: number): Buffer {
    const hex = bigIntToHexadecimal(n)

    // Calculate the minimum buffer size required to represent 'n' in bytes.
    // Each hexadecimal character represents 4 bits, so 2 characters are 1 byte.
    const minSize = Math.ceil(hex.length / 2)

    if (!size) {
        size = minSize
    } else if (size < minSize) {
        throw Error(`Size ${size} is too small, need at least ${minSize} bytes`)
    }

    // Allocate buffer of the desired size, filled with zeros.
    const buffer = Buffer.alloc(size, 0)

    const fromHex = Buffer.from(hex, "hex").reverse()
    fromHex.copy(buffer, 0)

    return buffer
}

/**
 * Converts a bigint to a buffer. Alias for beBigIntToBuffer.
 * @param n The bigint to convert.
 * @returns The buffer representation of the bigint.
 */
export function bigIntToBuffer(n: bigint): Buffer {
    return beBigIntToBuffer(n)
}

/**
 * Converts a BigNumberish type to a bigint. If the input is already a bigint,
 * the return value will be the bigint itself, otherwise it will be converted
 * to a bigint using big-endian byte order.
 * @param n The BigNumberish value to convert.
 * @returns The bigint representation of the BigNumberish value.
 */
export function bigNumberishToBigInt(n: BigNumberish): bigint {
    if (isNumber(n) || isBigInt(n) || isStringifiedBigInt(n) || isHexadecimal(n)) {
        return BigInt(n as BigNumber | number)
    }

    return bufferToBigInt(n as Buffer)
}

/**
 * Converts a BigNumberish type to a buffer. If the input is already a buffer,
 * the return value will be the buffer itself, otherwise it will be converted
 * to a buffer using big-endian byte order.
 * @param n The BigNumberish value to convert.
 * @returns The buffer representation of the BigNumberish value.
 */
export function bigNumberishToBuffer(n: BigNumberish): Buffer {
    if (isBuffer(n)) {
        return n as Buffer
    }

    return bigIntToBuffer(bigNumberishToBigInt(n))
}

/**
 * Converts an hexadecimal string to a buffer. The hexadecimal string
 * should not start with '0x' or '0X'. It keeps the bytes in the same order.
 * @param value The hexadecimal string to convert.
 * @returns The buffer representation of the hexadecimal string.
 */
export function hexadecimalToBuffer(value: string): Buffer {
    requireHexadecimal(value, "value", false)

    return Buffer.from(value, "hex")
}

/**
 * Converts a buffer to a hexadecimal string. It accepts 'Buffer' or 'Uint8Array'.
 * The hexadecimal string will not start with '0x' or '0X'. It keeps the bytes in the same order.
 * @param value The buffer to convert.
 * @returns The converted hexadecimal string.
 */
export function bufferToHexadecimal(value: Buffer | Uint8Array): string {
    requireTypes(value, "value", ["Buffer", "Uint8Array"])

    return Buffer.from(value).toString("hex")
}
