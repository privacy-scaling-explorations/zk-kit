// @ts-ignore
import { Blake512 } from "blake-hash/lib"

/**
 * Computes the Blake512 hash of the input message.
 * Blake512 is a cryptographic hash function that produces a hash value of 512 bits,
 * commonly used for data integrity checks and other cryptographic applications.
 * @param message The input data to hash, provided as a Buffer.
 * @returns A Buffer containing the 512-bit hash result.
 */
export default function hash(message: Buffer): Buffer {
    const engine = new Blake512()

    engine.update(message)

    return engine.digest()
}
