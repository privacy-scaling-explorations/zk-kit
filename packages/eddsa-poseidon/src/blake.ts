/**
 * Copyright
 * This code is a TypeScript adaptation of the 'blake-hash' library code (https://www.npmjs.com/package/blake-hash)
 * using the 'buffer' npm package (https://www.npmjs.com/package/buffer).
 * The 'js-crypto' library (https://github.com/iden3/js-crypto/blob/main/src/blake.ts) from Iden3 was used as a reference
 * for this work, specifically for types and adaptation.
 */

/**
 * @module Blake
 * Implements the Blake-512 cryptographic hash function.
 * Blake-512 is part of the BLAKE family of cryptographic hash functions, known
 * for its speed and security. This module offers functionality to compute Blake-512
 * hashes of input data, providing both one-time hashing capabilities and incremental
 * hashing to process large or streaming data.
 *
 * This code is adapted to serve as a wrapper around the "blake-hash" JavaScript library,
 * ensuring compatibility and performance in TypeScript environments. It supports hashing
 * with incremental updates and final digest retrieval.
 */

import { Buffer } from "buffer"
import createBlakeHash from "blake-hash"
import { HashFunction } from "./HashFunction"

/**
 * Represents a Blake-512 hash computation instance, wrapping the 'blake-hash' library.
 * This class maintains an internal instance of the underlying library to process input data.
 * It supports incremental hashing, allowing data to be added in chunks.
 */
/* eslint-disable import/prefer-default-export */
export default class Blake512 implements HashFunction {
    private _hash: ReturnType<typeof createBlakeHash>

    /**
     * Initializes a new Blake-512 hash instance by creating an instance
     * of the underlying blake-hash library for the "blake512" variant.
     */
    constructor() {
        this._hash = createBlakeHash("blake512")
    }

    /**
     * Completes the hash computation and returns the final hash value.
     * @returns The Blake-512 hash of the input data as a Buffer.
     */
    digest(): Buffer {
        // The underlying blake-hash returns a Buffer by default.
        return this._hash.digest() as Buffer
    }

    /**
     * Updates the hash with new data. This method can be called multiple
     * times to incrementally add data to the hash computation.
     * @param data The data to add to the hash.
     * @returns This instance, to allow method chaining.
     */
    update(data: Buffer | Uint8Array): this {
        // The underlying library expects a Buffer or Uint8Array, which we already have.
        this._hash.update(data)
        return this
    }
}
