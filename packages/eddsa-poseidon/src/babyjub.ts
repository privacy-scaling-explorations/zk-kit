import Field1 from "./field1"
import * as scalar from "./scalar"
import { Point } from "./types"

export const F = new Field1(BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617"))

export const Base8: Point<bigint> = [
    F.e(BigInt("5299619240641551281634865583518297030282874472190772894086521144482721001553")),
    F.e(BigInt("16950150798460657717958625567821834550301663161624707787222815936182638968203"))
]

export const order = BigInt("21888242871839275222246405745257275088614511777268538073601725287587578984328")
export const subOrder = scalar.shiftRight(order, BigInt(3))

const A = F.e(BigInt("168700"))
const D = F.e(BigInt("168696"))

export function addPoint(a: Point<bigint>, b: Point<bigint>): Point<bigint> {
    const beta = F.mul(a[0], b[1])
    const gamma = F.mul(a[1], b[0])
    const delta = F.mul(F.sub(a[1], F.mul(A, a[0])), F.add(b[0], b[1]))

    const tau = F.mul(beta, gamma)
    const dtau = F.mul(D, tau)

    const x = F.div(F.add(beta, gamma), F.add(F.one, dtau))
    const y = F.div(F.add(delta, F.sub(F.mul(A, beta), gamma)), F.sub(F.one, dtau))

    return [x, y]
}

export function mulPointEscalar(base: Point<bigint>, e: bigint): Point<bigint> {
    let res: Point<bigint> = [F.e(BigInt(0)), F.e(BigInt(1))]
    let rem: bigint = e
    let exp: Point<bigint> = base

    while (!scalar.isZero(rem)) {
        if (scalar.isOdd(rem)) {
            res = addPoint(res, exp)
        }

        exp = addPoint(exp, exp)
        rem = scalar.shiftRight(rem, BigInt(1))
    }

    return res
}

export function inCurve(p: Point) {
    p[0] = BigInt(p[0])
    p[1] = BigInt(p[1])

    const x2 = F.square(p[0])
    const y2 = F.square(p[1])

    return F.eq(F.add(F.mul(A, x2), y2), F.add(F.one, F.mul(F.mul(x2, y2), D)))
}
