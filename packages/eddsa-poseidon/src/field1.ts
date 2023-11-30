export default class Field1 {
    one = BigInt(1)
    zero = BigInt(0)

    _order: bigint

    constructor(order: bigint) {
        this._order = order
    }

    e(res: bigint): bigint {
        // if (res < 0) {
        // let nres = -res

        // if (nres >= this._order) nres %= this._order

        // return this._order - nres
        // }

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
        // if (!a) throw new Error("Division by zero")

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
}
