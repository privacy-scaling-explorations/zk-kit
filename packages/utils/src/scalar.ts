/**
 * @module Scalar
 * This module provides utility functions for performing scalar operations
 * within a field, especially designed to handle operations on bigints.
 * The operations include scalar inversion (`inv`), scalar exponentiation (`pow`),
 * and modular reduction. Functions are carefully implemented to ensure
 * mathematical correctness and efficiency, supporting both positive and
 * negative bigint values. The module aims to provide robust tools for
 * cryptographic calculations and other applications requiring high-precision
 * arithmetic in fields.
 */

/**
 * Checks if a bigint scalar value is zero.
 * @param a The bigint scalar value to check.
 * @returns True if 'a' is zero, false otherwise.
 */
export function isZero(a: bigint): boolean {
    return !a
}

/**
 * Determines whether a bigint scalar value is odd.
 * @param a The bigint scalar value to check.
 * @returns True if 'a' is odd, false if it is even.
 */
export function isOdd(a: bigint): boolean {
    return (a & BigInt(1)) === BigInt(1)
}

/**
 * Performs a bitwise right shift on a bigint scalar value.
 * This operation is equivalent to dividing by 2^n, but it operates directly
 * on the binary representation, making it efficient for certain types of calculations.
 * @param a The bigint scalar value to shift.
 * @param n The number of bits to shift 'a' by.
 * @returns The result of shifting 'a' right by 'n' bits.
 */
export function shiftRight(a: bigint, n: bigint): bigint {
    return a >> n
}

/**
 * Multiplies two bigint scalar values.
 * @param a The first bigint scalar value.
 * @param b The second bigint scalar value.
 * @returns The product of 'a' and 'b'.
 */
export function mul(a: bigint, b: bigint): bigint {
    return a * b
}

/**
 * Compares two bigint scalar values to determine if the first is greater than the second.
 * @param a The first bigint scalar value to compare.
 * @param b The second bigint scalar value to compare.
 * @returns True if 'a' is greater than 'b', false otherwise.
 */
export function gt(a: bigint, b: bigint) {
    return a > b
}

/**
 * Converts a bigint scalar value into an array of bits, represented as numbers.
 * This function is particularly useful for examining the binary structure of bigints,
 * which can be necessary for bit manipulation and understanding the representation
 * of numbers at a lower level.
 * @param n The bigint scalar value to convert into bits.
 * @returns An array of numbers representing the bits of 'n', starting from the least significant bit.
 */
export function bits(n: bigint): number[] {
    const res = []
    let E = n

    while (E) {
        if (E & BigInt(1)) {
            res.push(1)
        } else {
            res.push(0)
        }

        E >>= BigInt(1)
    }

    return res
}
