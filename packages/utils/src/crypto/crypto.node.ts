import { randomBytes } from "crypto"

/**
 * Generates a random sequence of bytes securely using Node.js's crypto module.
 * @param size The number of bytes to generate.
 * @returns A Uint8Array containing the generated random bytes.
 */
/* eslint-disable import/prefer-default-export */
export function getRandomValues(size: number): Uint8Array {
    if (size <= 0) throw Error(`size ${size} is too small, need at least 1`)

    const buffer = randomBytes(size)

    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
}
