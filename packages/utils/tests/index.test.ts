import { F1Field } from "../src"

describe("Utils", () => {
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

            expect(a).toBe(BigInt(0))
            expect(b).toBe(BigInt(10))
        })
    })
})
