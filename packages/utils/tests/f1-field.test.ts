import { F1Field } from "../src"

describe("F1Field", () => {
    let field: F1Field

    beforeEach(() => {
        field = new F1Field(BigInt(12))
    })

    it("Should create a finite field with a specific order", async () => {
        expect(field.one).toBe(BigInt(1))
        expect(field.zero).toBe(BigInt(0))
        expect(field._order).toBe(BigInt(12))
        expect(field._half).toBe(BigInt(12) >> BigInt(1))
        expect(field._negone).toBe(BigInt(12) - BigInt(1))
    })

    it("Should map the value back into the finite field", async () => {
        const a = field.e(BigInt(24))
        const b = field.e(BigInt(-2))
        const c = field.e(BigInt(-13))

        expect(a).toBe(BigInt(0))
        expect(b).toBe(BigInt(10))
        expect(c).toBe(BigInt(11))
    })

    it("Should add into the finite field", async () => {
        const a = field.e(BigInt(2))
        const b = field.e(BigInt(20))

        expect(field.add(a, a)).toBe(BigInt(4))
        expect(field.add(b, a)).toBe(BigInt(10))
    })

    it("Should sub into the finite field", async () => {
        const a = field.e(BigInt(4))
        const b = field.e(BigInt(2))

        expect(field.sub(a, b)).toBe(BigInt(2))
        expect(field.sub(b, a)).toBe(BigInt(10))
    })

    it("Should mul into the finite field", async () => {
        const a = field.e(BigInt(2))

        expect(field.mul(a, a)).toBe(BigInt(4))
    })

    it("Should div into the finite field", async () => {
        const a = field.e(BigInt(2))
        const b = field.e(BigInt(4))

        expect(field.div(a, b)).toBe(BigInt(2))
    })

    it("Should eq into the finite field", async () => {
        const a = field.e(BigInt(2))
        const b = field.e(BigInt(3))

        expect(field.eq(a, a)).toBeTruthy()
        expect(field.eq(a, b)).toBeFalsy()
    })

    it("Should square into the finite field", async () => {
        const a = field.e(BigInt(2))

        expect(field.square(a)).toBe(BigInt(4))
    })

    it("Should inv into the finite field", async () => {
        const a = field.e(BigInt(2))
        const b = field.e(BigInt(11))

        expect(field.inv(a)).toBe(BigInt(1))
        expect(field.inv(b)).toBe(BigInt(11))
    })

    it("Should lt into the finite field", async () => {
        const a = field.e(BigInt(2))
        const b = field.e(BigInt(3))

        expect(field.lt(a, b)).toBeTruthy()
        expect(field.lt(b, a)).toBeFalsy()
    })

    it("Should geq into the finite field", async () => {
        const a = field.e(BigInt(2))
        const b = field.e(BigInt(3))

        expect(field.geq(a, b)).toBeFalsy()
        expect(field.geq(b, a)).toBeTruthy()
    })

    it("Should neg into the finite field", async () => {
        const a = field.e(BigInt(2))
        const b = field.e(BigInt(-3))

        expect(field.neg(a)).toBe(BigInt(10))
        expect(field.neg(b)).toBe(BigInt(3))
    })

    it("Should isZero into the finite field", async () => {
        const a = field.e(BigInt(0))
        const b = field.e(BigInt(1))

        expect(field.isZero(a)).toBeTruthy()
        expect(field.isZero(b)).toBeFalsy()
    })

    it("Should pow into the finite field", async () => {
        const a = field.e(BigInt(0))
        const b = field.e(BigInt(1))
        const c = field.e(BigInt(2))
        const d = field.e(BigInt(-1))

        expect(field.pow(b, a)).toBe(BigInt(1))
        expect(field.pow(b, c)).toBe(BigInt(1))
        expect(field.pow(a, b)).toBe(BigInt(0))
        expect(field.pow(a, d)).toBe(BigInt(0))
        expect(field.pow(0n, -1n)).toBe(BigInt(0))
        expect(field.pow(2n, -1n)).toBe(field.inv(2n))
        expect(field.pow(5n, -30n)).toBe(1n)
    })
})
