import { randomBytes as rb } from "crypto"

/**
 * Generates a random bigint value. It leverages Node.js's crypto module to create
 * a buffer of size securely generated random bytes. The bytes are then converted to
 * a hexadecimal string, which is used to create a bigint.
 * @param size The number of bytes.
 * @returns A randomly generated bigint value.
 */
/* eslint-disable import/prefer-default-export */
export function getRandomValue(size: number): bigint {
    if (size === 0) throw Error(`size ${size} is too small, need at least 1`)

    return BigInt(`0x${rb(size).toString("hex")}`)
}
