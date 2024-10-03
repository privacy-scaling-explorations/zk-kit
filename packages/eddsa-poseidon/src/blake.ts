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
 * This code is adapted from the "blake-hash" JavaScript library, ensuring compatibility
 * and performance in TypeScript environments. It supports hashing with optional
 * salt for enhanced security in certain contexts.
 */

import { Buffer } from "buffer"
import { HashFunction } from "./HashFunction"

const zo = Buffer.from([0x01])
const oo = Buffer.from([0x81])

// Static properties for sigma, u256, u512, and padding are defined here below
const sigma = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    [14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3],
    [11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4],
    [7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8],
    [9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13],
    [2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9],
    [12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11],
    [13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10],
    [6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5],
    [10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    [14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3],
    [11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4],
    [7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8],
    [9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13],
    [2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9]
]

const u512 = [
    0x243f6a88, 0x85a308d3, 0x13198a2e, 0x03707344, 0xa4093822, 0x299f31d0, 0x082efa98, 0xec4e6c89, 0x452821e6,
    0x38d01377, 0xbe5466cf, 0x34e90c6c, 0xc0ac29b7, 0xc97c50dd, 0x3f84d5b5, 0xb5470917, 0x9216d5d9, 0x8979fb1b,
    0xd1310ba6, 0x98dfb5ac, 0x2ffd72db, 0xd01adfb7, 0xb8e1afed, 0x6a267e96, 0xba7c9045, 0xf12c7f99, 0x24a19947,
    0xb3916cf7, 0x0801f2e2, 0x858efc16, 0x636920d8, 0x71574e69
]

const padding = Buffer.from([
    0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
])

/**
 * Performs a bitwise rotation on the values of two elements in an array.
 * This operation is a key component of the Blake-512 algorithm, enabling
 * the mixing of bits in a non-linear fashion.
 * @param v The array containing values to rotate.
 * @param i The index of the first element to rotate.
 * @param j The index of the second element to rotate.
 * @param n The number of bits to rotate by.
 */

function rot(v: number[], i: number, j: number, n: number): void {
    let hi = v[i * 2] ^ v[j * 2]
    let lo = v[i * 2 + 1] ^ v[j * 2 + 1]

    if (n >= 32) {
        lo ^= hi
        hi ^= lo
        lo ^= hi
        n -= 32
    }

    if (n === 0) {
        v[i * 2] = hi >>> 0
        v[i * 2 + 1] = lo >>> 0
    } else {
        v[i * 2] = ((hi >>> n) | (lo << (32 - n))) >>> 0
        v[i * 2 + 1] = ((lo >>> n) | (hi << (32 - n))) >>> 0
    }
}

/**
 * The G function is one of the core operations in the Blake-512 compression function.
 * It mixes the input values based on the message block and the round constants,
 * contributing to the diffusion and confusion properties of the hash function.
 * @param v The working vector, part of the state being updated.
 * @param m - The message block being processed.
 * @param i The current round index.
 * @param a, b, c, d Indices within the working vector to mix.
 * @param e Index within the message block and round constants.
 */
function g(v: number[], m: number[], i: number, a: number, b: number, c: number, d: number, e: number): void {
    let lo

    // v[a] += (m[sigma[i][e]] ^ u512[sigma[i][e+1]]) + v[b];
    lo = v[a * 2 + 1] + ((m[sigma[i][e] * 2 + 1] ^ u512[sigma[i][e + 1] * 2 + 1]) >>> 0) + v[b * 2 + 1]
    v[a * 2] =
        (v[a * 2] + ((m[sigma[i][e] * 2] ^ u512[sigma[i][e + 1] * 2]) >>> 0) + v[b * 2] + ~~(lo / 0x0100000000)) >>> 0
    v[a * 2 + 1] = lo >>> 0

    // v[d] = ROT( v[d] ^ v[a],32);
    rot(v, d, a, 32)

    // v[c] += v[d];
    lo = v[c * 2 + 1] + v[d * 2 + 1]
    v[c * 2] = (v[c * 2] + v[d * 2] + ~~(lo / 0x0100000000)) >>> 0
    v[c * 2 + 1] = lo >>> 0

    // v[b] = ROT( v[b] ^ v[c],25);
    rot(v, b, c, 25)

    // v[a] += (m[sigma[i][e+1]] ^ u512[sigma[i][e]])+v[b];
    lo = v[a * 2 + 1] + ((m[sigma[i][e + 1] * 2 + 1] ^ u512[sigma[i][e] * 2 + 1]) >>> 0) + v[b * 2 + 1]
    v[a * 2] =
        (v[a * 2] + ((m[sigma[i][e + 1] * 2] ^ u512[sigma[i][e] * 2]) >>> 0) + v[b * 2] + ~~(lo / 0x0100000000)) >>> 0
    v[a * 2 + 1] = lo >>> 0

    // v[d] = ROT( v[d] ^ v[a],16);
    rot(v, d, a, 16)

    // v[c] += v[d];
    lo = v[c * 2 + 1] + v[d * 2 + 1]
    v[c * 2] = (v[c * 2] + v[d * 2] + ~~(lo / 0x0100000000)) >>> 0
    v[c * 2 + 1] = lo >>> 0

    // v[b] = ROT( v[b] ^ v[c],11)
    rot(v, b, c, 11)
}

/**
 * Processes the carry for the bit length counter, ensuring it remains
 * within bounds as a 128-bit number.
 * @param arr The array representing the 128-bit counter.
 */
function lengthCarry(arr: number[]) {
    for (let j = 0; j < arr.length; j += 1) {
        if (arr[j] < 0x0100000000) break
        arr[j] -= 0x0100000000
        arr[j + 1] += 1
    }
}

/**
 * Represents a Blake-512 hash computation instance.
 * This class maintains the internal state, buffers, and counters needed to
 * process input data and produce the final hash output. It supports incremental
 * hashing, allowing data to be added in chunks.
 */
/* eslint-disable import/prefer-default-export */
export default class Blake512 implements HashFunction {
    private _h: number[]
    private _s: number[]
    private _block: Buffer
    private _blockOffset: number
    private _length: number[]
    private _zo: Buffer
    private _oo: Buffer
    private _nullt: boolean

    /**
     * Initializes a new Blake-512 hash instance with the default parameters.
     */
    constructor() {
        this._h = [
            0x6a09e667, 0xf3bcc908, 0xbb67ae85, 0x84caa73b, 0x3c6ef372, 0xfe94f82b, 0xa54ff53a, 0x5f1d36f1, 0x510e527f,
            0xade682d1, 0x9b05688c, 0x2b3e6c1f, 0x1f83d9ab, 0xfb41bd6b, 0x5be0cd19, 0x137e2179
        ]

        this._s = [0, 0, 0, 0, 0, 0, 0, 0]

        this._block = Buffer.alloc(128)
        this._blockOffset = 0
        this._length = [0, 0, 0, 0]

        this._nullt = false

        this._zo = zo
        this._oo = oo
    }

    /**
     * The core compression function for Blake-512. It transforms the internal
     * state based on the input block and the current hash parameters.
     */
    _compress() {
        const v = new Array(32)
        const m = new Array(32)
        let i

        for (i = 0; i < 32; i += 1) m[i] = this._block.readUInt32BE(i * 4)
        for (i = 0; i < 16; i += 1) v[i] = this._h[i] >>> 0
        for (i = 16; i < 24; i += 1) v[i] = (this._s[i - 16] ^ u512[i - 16]) >>> 0
        for (i = 24; i < 32; i += 1) v[i] = u512[i - 16]

        if (!this._nullt) {
            v[24] = (v[24] ^ this._length[1]) >>> 0
            v[25] = (v[25] ^ this._length[0]) >>> 0
            v[26] = (v[26] ^ this._length[1]) >>> 0
            v[27] = (v[27] ^ this._length[0]) >>> 0
            v[28] = (v[28] ^ this._length[3]) >>> 0
            v[29] = (v[29] ^ this._length[2]) >>> 0
            v[30] = (v[30] ^ this._length[3]) >>> 0
            v[31] = (v[31] ^ this._length[2]) >>> 0
        }

        for (i = 0; i < 16; i += 1) {
            /* column step */
            g(v, m, i, 0, 4, 8, 12, 0)
            g(v, m, i, 1, 5, 9, 13, 2)
            g(v, m, i, 2, 6, 10, 14, 4)
            g(v, m, i, 3, 7, 11, 15, 6)
            /* diagonal step */
            g(v, m, i, 0, 5, 10, 15, 8)
            g(v, m, i, 1, 6, 11, 12, 10)
            g(v, m, i, 2, 7, 8, 13, 12)
            g(v, m, i, 3, 4, 9, 14, 14)
        }

        for (i = 0; i < 16; i += 1) {
            this._h[(i % 8) * 2] = (this._h[(i % 8) * 2] ^ v[i * 2]) >>> 0
            this._h[(i % 8) * 2 + 1] = (this._h[(i % 8) * 2 + 1] ^ v[i * 2 + 1]) >>> 0
        }

        for (i = 0; i < 8; i += 1) {
            this._h[i * 2] = (this._h[i * 2] ^ this._s[(i % 4) * 2]) >>> 0
            this._h[i * 2 + 1] = (this._h[i * 2 + 1] ^ this._s[(i % 4) * 2 + 1]) >>> 0
        }
    }

    /**
     * Adds padding to the message as per the Blake-512 specification, ensuring
     * the message length is a multiple of the block size.
     */
    _padding() {
        const len = this._length.slice()
        len[0] += this._blockOffset * 8
        lengthCarry(len)

        const msglen = Buffer.alloc(16)
        for (let i = 0; i < 4; i += 1) msglen.writeUInt32BE(len[3 - i], i * 4)

        if (this._blockOffset === 111) {
            this._length[0] -= 8
            this.update(this._oo)
        } else {
            if (this._blockOffset < 111) {
                if (this._blockOffset === 0) this._nullt = true
                this._length[0] -= (111 - this._blockOffset) * 8
                this.update(padding.subarray(0, 111 - this._blockOffset))
            } else {
                this._length[0] -= (128 - this._blockOffset) * 8
                this.update(padding.subarray(0, 128 - this._blockOffset))
                this._length[0] -= 111 * 8
                this.update(padding.subarray(1, 1 + 111))
                this._nullt = true
            }

            this.update(this._zo)
            this._length[0] -= 8
        }

        this._length[0] -= 128
        this.update(msglen)
    }

    /**
     * Completes the hash computation and returns the final hash value.
     * This method applies the necessary padding, performs the final compression,
     * and returns the hash output.
     * @returns The Blake-512 hash of the input data.
     */
    digest(): Buffer {
        this._padding()

        const buffer = Buffer.alloc(64)
        for (let i = 0; i < 16; i += 1) buffer.writeUInt32BE(this._h[i], i * 4)
        return buffer
    }

    /**
     * Updates the hash with new data. This method can be called multiple
     * times to incrementally add data to the hash computation.
     * @param data The data to add to the hash.
     * @returns This instance, to allow method chaining.
     */
    update(data: Buffer) {
        const block = this._block
        let offset = 0

        while (this._blockOffset + data.length - offset >= block.length) {
            for (let i = this._blockOffset; i < block.length; )
                /* eslint-disable no-plusplus */
                block[i++] = data[offset++]

            this._length[0] += block.length * 8
            lengthCarry(this._length)

            this._compress()
            this._blockOffset = 0
        }

        while (offset < data.length)
            /* eslint-disable no-plusplus */
            block[this._blockOffset++] = data[offset++]

        return this
    }
}
