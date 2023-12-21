import { babyjub } from "circomlibjs"
import { addPoint, mulPointEscalar, Base8, inCurve, packPoint, unpackPoint, Point } from "../src"

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

        expect(packedPoint).toBe(BigInt(`0x${Buffer.from(expectedPackedPoint).toString("hex")}`))
    })

    it("Should unpack a packed public key", async () => {
        const publicKey = mulPointEscalar(Base8, secretScalar)
        const packedPoint = packPoint(publicKey)
        const unpackedPoint = unpackPoint(packedPoint) as Point<bigint>

        expect(unpackedPoint).not.toBeNull()
        expect(unpackedPoint[0]).toBe(publicKey[0])
        expect(unpackedPoint[1]).toBe(publicKey[1])
    })
})
