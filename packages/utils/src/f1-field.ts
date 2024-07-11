import * as scalar from "./scalar"

/**
 * @class F1Field
 * Represents a finite field of order 'order' providing arithmetic operations under modulus.
 * This class includes operations such as addition, subtraction, multiplication, division,
 * and inversion, all performed modulo the field's order. It's designed to work with bigints,
 * supporting large numbers for cryptographic purposes and other applications requiring
 * modular arithmetic.
 * Note that the outputs of the functions will always be within the field if and only if
 * the input values are within the field. Devs need to make sure of that.
 *
 * @property one Represents the scalar value 1 in the field.
 * @property zero Represents the scalar value 0 in the field.
 * @property _order The order of the finite field (i.e., the modulus).
 * @property _half Half the order of the field, used for certain comparisons.
 * @property _negone The scalar value -1 in the field, represented positively.
 */
export default class F1Field {
    one = 1n
    zero = 0n

    _order: bigint
    _half: bigint
    _negone: bigint

    constructor(order: bigint) {
        this._order = order
        this._half = order >> this.one
        this._negone = this._order - this.one
    }

    /**
     * Ensures a given result falls within the field by applying modular reduction.
     * This method also handles negative inputs, correctly mapping them into the field.
     * @param res The result to be normalized to the field.
     * @returns The equivalent value within the field.
     */
    e(res: bigint): bigint {
        res %= this._order

        return res < 0 ? res + this._order : res
    }

    /**
     * Performs modular multiplication of two bigint values within the field.
     * @param a The first value.
     * @param b The second value.
     * @returns The product of 'a' and 'b' modulo the field's order.
     */
    mul(a: bigint, b: bigint): bigint {
        return (a * b) % this._order
    }

    /**
     * Subtracts one bigint from another under modulus.
     * It ensures the result is within the field if and only if the input values are within the field.
     * @param a The value from which to subtract.
     * @param b The value to be subtracted.
     * @returns The difference of 'a' and 'b' modulo the field's order.
     */
    sub(a: bigint, b: bigint): bigint {
        return a >= b ? a - b : this._order - b + a
    }

    /**
     * Adds two bigint values together under modulus.
     * It ensures the result is within the field if and only if the input values are within the field.
     * @param a The first value.
     * @param b The second value.
     * @returns The sum of 'a' and 'b' modulo the field's order.
     */
    add(a: bigint, b: bigint): bigint {
        const res = a + b

        return res >= this._order ? res - this._order : res
    }

    /**
     * Computes the multiplicative inverse of a given value within the field.
     * This method uses the Extended Euclidean Algorithm to find the inverse,
     * ensuring the result is always a positive value less than the field's order.
     * If the input value is zero, which has no inverse, an error is thrown.
     * @param a The value for which to compute the inverse.
     * @returns The multiplicative inverse of 'a' modulo the field's order.
     * @throws if 'a' is zero.
     */
    inv(a: bigint): bigint {
        if (a === this.zero) {
            throw new Error("Zero has no inverse")
        }

        let t = this.zero
        let r = this._order
        let newt = this.one
        let newr = a % this._order

        while (newr) {
            const q = r / newr
            ;[t, newt] = [newt, t - q * newt]
            ;[r, newr] = [newr, r - q * newr]
        }

        if (t < this.zero) {
            t += this._order
        }

        return t
    }

    /**
     * Divides one bigint by another within the field by multiplying the first value
     * by the multiplicative inverse of the second.
     * @param a The dividend.
     * @param b The divisor.
     * @returns The result of the division of 'a' by 'b' modulo the field's order.
     */
    div(a: bigint, b: bigint): bigint {
        return this.mul(a, this.inv(b))
    }

    /**
     * Checks if two bigint values are equal within the context of the field.
     * It ensures the result is within the field if and only if the input values are within the field.
     * @param a The first value to compare.
     * @param b The second value to compare.
     * @returns True if 'a' equals 'b', false otherwise.
     */
    eq(a: bigint, b: bigint): boolean {
        return a === b
    }

    /**
     * Squares a bigint value within the field.
     * This is a specific case of multiplication where the value is multiplied by itself,
     * optimized for performance where applicable.
     * It ensures the result is within the field if and only if the input values are within the field.
     * @param a The value to square.
     * @returns The square of 'a' modulo the field's order.
     */
    square(a: bigint): bigint {
        return (a * a) % this._order
    }

    /**
     * Compares two bigint values to determine if the first is less than the second,
     * taking into account the field's order for modular comparison.
     * It ensures the result is within the field if and only if the input values are within the field.
     * @param a The first value to compare.
     * @param b The second value to compare.
     * @returns True if 'a' is less than 'b', false otherwise.
     */
    lt(a: bigint, b: bigint) {
        const aa = a > this._half ? a - this._order : a
        const bb = b > this._half ? b - this._order : b

        return aa < bb
    }

    /**
     * Compares two bigint values to determine if the first is greater than or equal to the second,
     * considering the field's modular context.
     * It ensures the result is within the field if and only if the input values are within the field.
     * @param a The first value to compare.
     * @param b The second value to compare.
     * @returns True if 'a' is greater than or equal to 'b', false otherwise.
     */
    geq(a: bigint, b: bigint) {
        const aa = a > this._half ? a - this._order : a
        const bb = b > this._half ? b - this._order : b

        return aa >= bb
    }

    /**
     * Computes the negation of a bigint value within the field.
     * The result is the modular additive inverse that, when added to the original value,
     * yields zero in the field's modulus.
     * It ensures the result is within the field if and only if the input values are within the field.
     * @param a The value to negate.
     * @returns The negation of 'a' modulo the field's order.
     */
    neg(a: bigint) {
        return a ? this._order - a : a
    }

    /**
     * Checks if a bigint value is zero within the context of the field.
     * @param a The value to check.
     * @returns True if 'a' is zero, false otherwise.
     */
    isZero(a: bigint) {
        return a === this.zero
    }

    /**
     * Raises a base to an exponent within the field, efficiently computing
     * scalar exponentiation using the square-and-multiply algorithm.
     * Supports both positive and negative exponents through the use of the `inv` method for negatives.
     * @param base The base to be exponentiated.
     * @param e The exponent.
     * @returns The result of raising 'base' to the power 'e' modulo the field's order.
     */
    pow(base: bigint, e: bigint) {
        if (scalar.isZero(e)) {
            return this.one
        }

        if (e < 0n) {
            base = this.inv(base)
            e = -e
        }

        const n = scalar.bits(e)

        if (n.length === 0) {
            return this.one
        }

        let res = base

        for (let i = n.length - 2; i >= 0; i -= 1) {
            res = this.square(res)

            if (n[i]) {
                res = this.mul(res, base)
            }
        }

        return res
    }
}
