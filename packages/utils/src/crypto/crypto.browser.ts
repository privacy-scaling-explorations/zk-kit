/**
 * Generates a secure random sequence of bytes using the Web Cryptography API.
 * @param size The number of bytes to generate.
 * @returns A Uint8Array containing the generated random bytes.
 */
/* eslint-disable import/prefer-default-export */
export function getRandomValues(size: number): Uint8Array {
    if (size <= 0) throw Error(`size ${size} is too small, need at least 1`)

    const byteArray = new Uint8Array(size)

    crypto.getRandomValues(byteArray)

    return byteArray
}
