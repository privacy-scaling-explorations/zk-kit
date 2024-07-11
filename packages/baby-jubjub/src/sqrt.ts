import F1Field from "@zk-kit/utils/f1-field"

/**
 * The following is a sqrt function (i.e. tonelliShanks) with some pre-computed
 * constants and it only works with 'r'.
 * See {@link https://eprint.iacr.org/2012/685.pdf} and
 * {@link https://github.com/iden3/ffjavascript/blob/6f37a93fabddf45100bf221de6a1399599497e5d/src/fsqrt.js#L38}
 * for more.
 * @param n The number for which to calculate the square root.
 * @returns The square root.
 */
// eslint-disable-next-line import/prefer-default-export
export function tonelliShanks(n: bigint, order: bigint) {
    const Fr = new F1Field(order)

    const sqrt_s = 28
    const sqrt_z = BigInt("5978345932401256595026418116861078668372907927053715034645334559810731495452")
    const sqrt_tm1d2 = BigInt("40770029410420498293352137776570907027550720424234931066070132305055")

    if (Fr.isZero(n)) return Fr.zero

    let w = Fr.pow(n, sqrt_tm1d2)
    const a0 = Fr.pow(Fr.mul(Fr.square(w), n), BigInt(2 ** (sqrt_s - 1)))

    if (Fr.eq(a0, Fr._negone)) {
        return null
    }

    let v = sqrt_s
    let x = Fr.mul(n, w)
    let b = Fr.mul(x, w)
    let z = sqrt_z

    while (!Fr.eq(b, Fr.one)) {
        let b2k = Fr.square(b)
        let k = 1
        while (!Fr.eq(b2k, Fr.one)) {
            b2k = Fr.square(b2k)
            k += 1
        }

        w = z

        for (let i = 0; i < v - k - 1; i += 1) {
            w = Fr.square(w)
        }

        z = Fr.square(w)
        b = Fr.mul(b, z)
        x = Fr.mul(x, w)
        v = k
    }

    return Fr.geq(x, Fr.zero) ? x : Fr.neg(x)
}
