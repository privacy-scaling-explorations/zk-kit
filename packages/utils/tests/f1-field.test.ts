import { F1Field } from "../src"

describe("F1Field", () => {
    let field: F1Field

    beforeEach(() => {
        field = new F1Field(12n)
    })

    it("Should create a finite field with a specific order", () => {
        expect(field.one).toBe(1n)
        expect(field.zero).toBe(0n)
        expect(field._order).toBe(12n)
        expect(field._half).toBe(12n >> 1n)
        expect(field._negone).toBe(12n - 1n)
    })

    it("Should map the value back into the finite field", () => {
        const a = field.e(24n)
        const b = field.e(-2n)
        const c = field.e(-13n)

        expect(a).toBe(0n)
        expect(b).toBe(10n)
        expect(c).toBe(11n)
    })

    it("Should add into the finite field", () => {
        const a = field.e(2n)
        const b = field.e(20n)
        const c = field.e(12n)

        expect(field.add(a, a)).toBe(4n)
        expect(field.add(b, a)).toBe(10n)
        expect(field.add(c, c)).toBe(0n)
    })

    it("Should sub into the finite field", () => {
        const a = field.e(4n)
        const b = field.e(2n)

        expect(field.sub(a, b)).toBe(2n)
        expect(field.sub(b, a)).toBe(10n)
    })

    it("Should mul into the finite field", () => {
        const a = field.e(2n)

        expect(field.mul(a, a)).toBe(4n)
    })

    it("Should div into the finite field", () => {
        const a = field.e(2n)
        const b = field.e(4n)

        expect(field.div(a, b)).toBe(2n)
    })

    it("Should eq into the finite field", () => {
        const a = field.e(2n)
        const b = field.e(3n)

        expect(field.eq(a, a)).toBeTruthy()
        expect(field.eq(a, b)).toBeFalsy()
    })

    it("Should square into the finite field", () => {
        const a = field.e(2n)

        expect(field.square(a)).toBe(4n)
    })

    it("Should inv into the finite field", () => {
        const a = field.e(2n)
        const b = field.e(11n)

        expect(field.inv(a)).toBe(1n)
        expect(field.inv(b)).toBe(11n)
    })

    it("Should lt into the finite field", () => {
        const a = field.e(2n)
        const b = field.e(3n)

        expect(field.lt(a, b)).toBeTruthy()
        expect(field.lt(b, a)).toBeFalsy()
    })

    it("Should geq into the finite field", () => {
        const a = field.e(2n)
        const b = field.e(3n)

        expect(field.geq(a, b)).toBeFalsy()
        expect(field.geq(b, a)).toBeTruthy()
    })

    it("Should neg into the finite field", () => {
        const a = field.e(2n)
        const b = field.e(-3n)

        expect(field.neg(a)).toBe(10n)
        expect(field.neg(b)).toBe(3n)
    })

    it("Should isZero into the finite field", () => {
        const a = field.e(0n)
        const b = field.e(1n)

        expect(field.isZero(a)).toBeTruthy()
        expect(field.isZero(b)).toBeFalsy()
    })

    it("Should pow into the finite field", async () => {
        const a = field.e(0n)
        const b = field.e(1n)
        const c = field.e(2n)
        const d = field.e(-1n)

        expect(field.pow(b, a)).toBe(1n)
        expect(field.pow(b, c)).toBe(1n)
        expect(field.pow(a, b)).toBe(0n)
        expect(field.pow(a, d)).toBe(0n)
        expect(field.pow(0n, -1n)).toBe(0n)
        expect(field.pow(2n, -1n)).toBe(field.inv(2n))
        expect(field.pow(5n, -30n)).toBe(1n)
    })
})
