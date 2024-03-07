import { getRandomValues } from "crypto"

/**
 * Generates a random bigint value. It uses the Web Cryptography API to securely generate
 * a random sequence of size bytes and then converts those bytes into a bigint using
 * big-endian byte order.
 * @param size The number of bytes.
 * @returns A randomly generated bigint value.
 */
/* eslint-disable import/prefer-default-export */
export function getRandomValue(size: number): bigint {
    if (size === 0) throw Error(`size ${size} is too small, need at least 1`)

    return BigInt(`0x${getRandomValues(Buffer.alloc(size)).toString("hex")}`)
}
