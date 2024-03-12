import { scalar } from "../src"

describe("scalar", () => {
    it("Should correctly compute scalar isZero", async () => {
        expect(scalar.isZero(BigInt(0))).toBeTruthy()
        expect(scalar.isZero(BigInt(1))).toBeFalsy()
    })

    it("Should correctly compute scalar isOdd", async () => {
        expect(scalar.isOdd(BigInt(1))).toBeTruthy()
        expect(scalar.isOdd(BigInt(0))).toBeFalsy()
    })

    it("Should correctly compute scalar shiftRight", async () => {
        expect(scalar.shiftRight(BigInt(0), BigInt(1))).toBe(BigInt(0))
        expect(scalar.shiftRight(BigInt(1), BigInt(0))).toBe(BigInt(1))
    })

    it("Should correctly compute scalar mul", async () => {
        expect(scalar.mul(BigInt(0), BigInt(1))).toBe(BigInt(0))
        expect(scalar.mul(BigInt(1), BigInt(0))).toBe(BigInt(0))
        expect(scalar.mul(BigInt(1), BigInt(1))).toBe(BigInt(1))
        expect(scalar.mul(BigInt(1), BigInt(2))).toBe(BigInt(2))
        expect(scalar.mul(BigInt(2), BigInt(1))).toBe(BigInt(2))
        expect(scalar.mul(BigInt(3), BigInt(4))).toBe(BigInt(12))
    })

    it("Should correctly compute scalar gt", async () => {
        expect(scalar.gt(BigInt(0), BigInt(1))).toBeFalsy()
        expect(scalar.gt(BigInt(1), BigInt(0))).toBeTruthy()
    })

    it("Should correctly compute scalar bits", async () => {
        expect(scalar.bits(BigInt(0))).toStrictEqual([])
        expect(scalar.bits(BigInt(1))).toStrictEqual([1])
        expect(scalar.bits(BigInt(2))).toStrictEqual([0, 1])
    })
})
