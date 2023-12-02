import Field from "./field"
import * as scalar from "./scalar"
import { Point } from "./types"

// Spec: https://eips.ethereum.org/EIPS/eip-2494

// 'r' is the alt_bn128 prime order.
export const r = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617")

// 'F' (F_r) is the prime finite field with r elements.
export const Fr = new Field(r)

// Base8 is the base point used to generate other points on the curve.
export const Base8: Point<bigint> = [
    Fr.e(BigInt("5299619240641551281634865583518297030282874472190772894086521144482721001553")),
    Fr.e(BigInt("16950150798460657717958625567821834550301663161624707787222815936182638968203"))
]

// Let E be the twisted Edwards elliptic curve defined over 'F_r'
// described by the equation 'ax^2 + y^2 = 1 + dx^2y^2'.

// 'a' and 'd' are the parameters of the equation:
const a = Fr.e(BigInt("168700"))
const d = Fr.e(BigInt("168696"))

// We call Baby Jubjub the curve 'E(F_r)', that is, the subgroup of 'F_r'-rational points of 'E'.

// 'order' is order of the elliptic curve 'E'.
export const order = BigInt("21888242871839275222246405745257275088614511777268538073601725287587578984328")
export const subOrder = scalar.shiftRight(order, BigInt(3))

/**
 * Performs point addition on the Baby Jubjub elliptic curve,
 * calculating a third point from two given points.
 * Let P1 = (x1, y1) and P2 = (x2, y2) be two arbitrary points of the curve.
 * Then P1 + P2 = (x3, y3) is calculated in the following way:
 * x3 = (x1*y2 + y1*x2)/(1 + d*x1*x2*y1*y2)
 * y3 = (y1*y2 - a*x1*x2)/(1 - d*x1*x2*y1*y2)
 * @param p1 - First point on the curve.
 * @param p2 - Second point on the curve.
 * @returns Resultant third point on the curve.
 */
export function addPoint(p1: Point<bigint>, p2: Point<bigint>): Point<bigint> {
    // beta = x1*y2
    const beta = Fr.mul(p1[0], p2[1])
    // gamma = y1*x2
    const gamma = Fr.mul(p1[1], p2[0])
    // delta = (y1-(a*x1))*(x2+y2)
    const delta = Fr.mul(Fr.sub(p1[1], Fr.mul(a, p1[0])), Fr.add(p2[0], p2[1]))

    // x1*x2*y1*y2
    const tau = Fr.mul(beta, gamma)
    // d*x1*x2*y1*y2
    const dtau = Fr.mul(d, tau)

    // x3 = (x1*y2 + y1*x2)/(1 + d*x1*x2*y1*y2)
    const p3x = Fr.div(Fr.add(beta, gamma), Fr.add(Fr.one, dtau))
    // y3 = (y1*y2 - a*x1*x2)/(1 - d*x1*x2*y1*y2)
    const p3y = Fr.div(Fr.add(delta, Fr.sub(Fr.mul(a, beta), gamma)), Fr.sub(Fr.one, dtau))

    return [p3x, p3y]
}

/**
 * Performs a scalar multiplication by starting from the 'base' point and 'adding'
 * it to itself 'e' times.
 * @param base - The base point used as a starting point.
 * @param e - A secret number representing the private key.
 * @returns The resulting point representing the public key.
 */
export function mulPointEscalar(base: Point<bigint>, e: bigint): Point<bigint> {
    let res: Point<bigint> = [Fr.e(BigInt(0)), Fr.e(BigInt(1))]
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

    const x2 = Fr.square(p[0])
    const y2 = Fr.square(p[1])

    return Fr.eq(Fr.add(Fr.mul(a, x2), y2), Fr.add(Fr.one, Fr.mul(Fr.mul(x2, y2), d)))
}
