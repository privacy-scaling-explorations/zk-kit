import { leBufferToBigint } from "@zk-kit/utils"
import { babyjub } from "circomlibjs"
import { Base8, Point, addPoint, inCurve, mulPointEscalar, packPoint, unpackPoint } from "../src"

describe("BabyJubjub", () => {
    const secretScalar = BigInt(324)

    let publicKey: Point<bigint>

    it("Should add 1 point to the curve", async () => {
        const p1: Point<bigint> = [BigInt(0), BigInt(1)]

        const newPoint = addPoint(p1, Base8)
        const circomlibNewPoint = babyjub.addPoint(p1, Base8)

        expect(newPoint[0]).toBe(circomlibNewPoint[0])
        expect(newPoint[1]).toBe(circomlibNewPoint[1])
    })

    it("Should derive a public key from a secret scalar", async () => {
        publicKey = mulPointEscalar(Base8, secretScalar)

        const circomlibPublicKey = babyjub.mulPointEscalar(Base8, secretScalar)

        expect(publicKey[0]).toBe(circomlibPublicKey[0])
        expect(publicKey[1]).toBe(circomlibPublicKey[1])
    })

    it("Should check if a point is in the curve", async () => {
        expect(inCurve(publicKey)).toBeTruthy()
    })

    it("Should pack a point", async () => {
        const packedPoint = packPoint(publicKey)

        const expectedPackedPoint = babyjub.packPoint(publicKey)

        expect(packedPoint).toBe(leBufferToBigint(expectedPackedPoint))
    })

    it("Should unpack a packed public key", async () => {
        const publicKey = mulPointEscalar(Base8, secretScalar)
        const packedPoint = packPoint(publicKey)
        const unpackedPoint = unpackPoint(packedPoint) as Point<bigint>

        expect(unpackedPoint).not.toBeNull()
        expect(unpackedPoint[0]).toBe(publicKey[0])
        expect(unpackedPoint[1]).toBe(publicKey[1])
    })

    it("Should unpack a packed public key with less bytes than 32", async () => {
        const publicKey: Point<bigint> = [
            BigInt("10207164244839265210731148792003399330071235260758262804307337735329782473514"),
            BigInt("4504034976288485670718230979254896078098063043333320048161019268102694534400")
        ]

        const packedPoint = packPoint(publicKey)
        const unpackedPoint = unpackPoint(packedPoint) as Point<bigint>

        expect(unpackedPoint).not.toBeNull()
        expect(unpackedPoint[0]).toBe(publicKey[0])
        expect(unpackedPoint[1]).toBe(publicKey[1])
    })
})
