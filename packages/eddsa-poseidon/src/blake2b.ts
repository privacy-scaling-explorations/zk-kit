/**
 * Copyright
 * This code is a Typescript adaptation of the Blakejs library code (https://github.com/blakejs/blakejs)
 * Which was adapted from the reference implementation in RFC7693
 */

import { HashFunction } from "./HashFunction"
import { toHex, normalizeInput } from "./utils"

/**
 * @module Blake2b
 * Implements the Blake2b cryptographic hash function.
 * Blake2b is a second iteration of the blake algorithm
 *
 * This code is adapted from the "blakeJS" JavaScript library, ensuring compatibility
 * and performance in TypeScript environments. It supports hashing with optional keys,
 * salt, output length or personalization for enhanced security in certain contexts.
 */

// 64-bit unsigned addition
// Sets v[a,a+1] += v[b,b+1]
// v should be a Uint32Array
function ADD64AA(v: Uint32Array, a: number, b: number): void {
    const o0 = v[a] + v[b]
    let o1 = v[a + 1] + v[b + 1]
    if (o0 >= 0x100000000) {
        o1 += 1
    }
    v[a] = o0
    v[a + 1] = o1
}

// 64-bit unsigned addition
// Sets v[a,a+1] += b
// b0 is the low 32 bits of b, b1 represents the high 32 bits
function ADD64AC(v: Uint32Array, a: number, b0: number, b1: number): void {
    let o0 = v[a] + b0
    if (b0 < 0) {
        o0 += 0x100000000
    }
    let o1 = v[a + 1] + b1
    if (o0 >= 0x100000000) {
        o1 += 1
    }
    v[a] = o0
    v[a + 1] = o1
}

// Little-endian byte access
function B2B_GET32(arr: Uint8Array, i: number): number {
    return arr[i] ^ (arr[i + 1] << 8) ^ (arr[i + 2] << 16) ^ (arr[i + 3] << 24)
}

// G Mixing function
function B2B_G(a: number, b: number, c: number, d: number, ix: number, iy: number, v: Uint32Array, m: Uint32Array) {
    const x0 = m[ix]
    const x1 = m[ix + 1]
    const y0 = m[iy]
    const y1 = m[iy + 1]

    ADD64AA(v, a, b)
    ADD64AC(v, a, x0, x1)

    let xor0 = v[d] ^ v[a]
    let xor1 = v[d + 1] ^ v[a + 1]
    v[d] = xor1
    v[d + 1] = xor0

    ADD64AA(v, c, d)

    xor0 = v[b] ^ v[c]
    xor1 = v[b + 1] ^ v[c + 1]
    v[b] = (xor0 >>> 24) ^ (xor1 << 8)
    v[b + 1] = (xor1 >>> 24) ^ (xor0 << 8)

    ADD64AA(v, a, b)
    ADD64AC(v, a, y0, y1)

    xor0 = v[d] ^ v[a]
    xor1 = v[d + 1] ^ v[a + 1]
    v[d] = (xor0 >>> 16) ^ (xor1 << 16)
    v[d + 1] = (xor1 >>> 16) ^ (xor0 << 16)

    ADD64AA(v, c, d)

    xor0 = v[b] ^ v[c]
    xor1 = v[b + 1] ^ v[c + 1]
    v[b] = (xor1 >>> 31) ^ (xor0 << 1)
    v[b + 1] = (xor0 >>> 31) ^ (xor1 << 1)
}

// Initialization Vector
const BLAKE2B_IV32 = new Uint32Array([
    0xf3bcc908, 0x6a09e667, 0x84caa73b, 0xbb67ae85, 0xfe94f82b, 0x3c6ef372, 0x5f1d36f1, 0xa54ff53a, 0xade682d1,
    0x510e527f, 0x2b3e6c1f, 0x9b05688c, 0xfb41bd6b, 0x1f83d9ab, 0x137e2179, 0x5be0cd19
])

const SIGMA8 = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3, 11, 8,
    12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4, 7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8, 9, 0, 5, 7, 2,
    4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13, 2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9, 12, 5, 1, 15, 14, 13,
    4, 10, 0, 7, 6, 3, 9, 2, 8, 11, 13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10, 6, 15, 14, 9, 11, 3, 0, 8, 12,
    2, 13, 7, 1, 4, 10, 5, 10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3
]

const SIGMA82 = new Uint8Array(SIGMA8.map((x) => x * 2))
// Compression function
const v = new Uint32Array(32)
const m = new Uint32Array(32)

export default class Blake2b implements HashFunction {
    private b: Uint8Array
    private h: Uint32Array
    private t: number
    private c: number
    private outlen: number

    /**
     * Constructor of the Blake2b engine
     * times to incrementally add data to the hash computation.
     * @param outlen The fixed output length of the generated hash
     * @param key Optional key parameter if keyed hashes are required
     * @param salt Optional salt for additional randomness
     * @param personal Personalisation parameter
     * @returns This instance, to allow method chaining.
     */
    constructor(outlen = 64, key?: Uint8Array, salt?: Uint8Array | string, personal?: Uint8Array | string) {
        if (outlen <= 0 || outlen > 64) throw new Error("Illegal output length, expected 0 < length <= 64")
        if (key && key.length > 64) throw new Error("Illegal key, expected Uint8Array with 0 < length <= 64")
        if (salt && salt.length !== 16) throw new Error("Illegal salt, expected Uint8Array with length 16")
        if (personal && personal.length !== 16) throw new Error("Illegal personal, expected Uint8Array with length 16")

        this.b = new Uint8Array(128)
        this.h = new Uint32Array(16)
        this.t = 0
        this.c = 0
        this.outlen = outlen || 64

        const parameterBlock = new Uint8Array(64).fill(0)
        parameterBlock[0] = outlen
        if (key) parameterBlock[1] = key.length
        parameterBlock[2] = 1
        parameterBlock[3] = 1

        if (salt !== undefined) {
            salt = normalizeInput(salt)
        }
        if (personal !== undefined) {
            personal = normalizeInput(personal)
        }

        if (salt) parameterBlock.set(salt, 32)
        if (personal) parameterBlock.set(personal, 48)

        for (let i = 0; i < 16; i += 1) {
            this.h[i] = BLAKE2B_IV32[i] ^ B2B_GET32(parameterBlock, i * 4)
        }

        if (key) {
            this.update(key)
            this.c = 128
        }
    }

    /**
     * Updates the hash with new data. This method can be called multiple
     * times to incrementally add data to the hash computation.
     * @param input The data to add to the hash.
     * @returns This instance, to allow method chaining.
     */
    update(input: Uint8Array | string) {
        input = normalizeInput(input)
        for (let i = 0; i < input.length; i += 1) {
            if (this.c === 128) {
                this.t += this.c
                this._compress(false)
                this.c = 0
            }

            this.b[this.c] = input[i]
            this.c += 1
        }
        return this
    }

    asHex() {
        return toHex(this.digest())
    }

    /**
     * Completes the hash computation and returns the final hash value.
     * This method applies the necessary padding, performs the final compression,
     * and returns the hash output.
     * @returns The Blake2b hash of the input data.
     */
    digest() {
        this.t += this.c

        while (this.c < 128) {
            this.b[this.c] = 0
            this.c += 1
        }

        this._compress(true)

        const out = new Uint8Array(this.outlen)
        for (let i = 0; i < this.outlen; i += 1) {
            out[i] = this.h[i >> 2] >> (8 * (i & 3))
        }

        return Buffer.from(out)
    }

    /**
     * The core compression function for Blake2b. It transforms the internal
     * state based on the input block and the current hash parameters.
     */
    _compress(last: boolean) {
        for (let i = 0; i < 16; i += 1) {
            v[i] = this.h[i]
            v[i + 16] = BLAKE2B_IV32[i]
        }

        v[24] ^= this.t
        v[25] ^= this.t / 0x100000000

        if (last) {
            v[28] = ~v[28]
            v[29] = ~v[29]
        }

        for (let i = 0; i < 32; i += 1) {
            m[i] = B2B_GET32(this.b, 4 * i)
        }

        for (let i = 0; i < 12; i += 1) {
            B2B_G(0, 8, 16, 24, SIGMA82[i * 16], SIGMA82[i * 16 + 1], v, m)
            B2B_G(2, 10, 18, 26, SIGMA82[i * 16 + 2], SIGMA82[i * 16 + 3], v, m)
            B2B_G(4, 12, 20, 28, SIGMA82[i * 16 + 4], SIGMA82[i * 16 + 5], v, m)
            B2B_G(6, 14, 22, 30, SIGMA82[i * 16 + 6], SIGMA82[i * 16 + 7], v, m)
            B2B_G(0, 10, 20, 30, SIGMA82[i * 16 + 8], SIGMA82[i * 16 + 9], v, m)
            B2B_G(2, 12, 22, 24, SIGMA82[i * 16 + 10], SIGMA82[i * 16 + 11], v, m)
            B2B_G(4, 14, 16, 26, SIGMA82[i * 16 + 12], SIGMA82[i * 16 + 13], v, m)
            B2B_G(6, 8, 18, 28, SIGMA82[i * 16 + 14], SIGMA82[i * 16 + 15], v, m)
        }

        for (let i = 0; i < 16; i += 1) {
            this.h[i] = this.h[i] ^ v[i] ^ v[i + 16]
        }
    }
}
