import * as scalar from "./scalar"

export default class Field {
    one = BigInt(1)
    zero = BigInt(0)

    _order: bigint
    _half: bigint
    _negone: bigint

    constructor(order: bigint) {
        this._order = order
        this._half = order >> this.one
        this._negone = this._order - this.one
    }

    e(res: bigint): bigint {
        if (res < 0) {
            let nres = -res

            if (nres >= this._order) {
                nres %= this._order
            }

            return this._order - nres
        }

        return res >= this._order ? res % this._order : res
    }

    mul(a: bigint, b: bigint): bigint {
        return (a * b) % this._order
    }

    sub(a: bigint, b: bigint): bigint {
        return a >= b ? a - b : this._order - b + a
    }

    add(a: bigint, b: bigint): bigint {
        const res = a + b

        return res >= this._order ? res - this._order : res
    }

    inv(a: bigint): bigint {
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

    div(a: bigint, b: bigint): bigint {
        return this.mul(a, this.inv(b))
    }

    eq(a: bigint, b: bigint): boolean {
        return a === b
    }

    square(a: bigint): bigint {
        return (a * a) % this._order
    }

    lt(a: bigint, b: bigint) {
        const aa = a > this._half ? a - this._order : a
        const bb = b > this._half ? b - this._order : b

        return aa < bb
    }

    geq(a: bigint, b: bigint) {
        const aa = a > this._half ? a - this._order : a
        const bb = b > this._half ? b - this._order : b

        return aa >= bb
    }

    neg(a: bigint) {
        return a ? this._order - a : a
    }

    isZero(a: bigint) {
        return a === this.zero
    }

    pow(base: bigint, e: bigint) {
        if (scalar.isZero(e)) {
            return this.one
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
