import { poseidon as expectedPoseidon } from "circomlibjs"
import { poseidon } from "../src"
import * as p from "../src"

describe("Poseidon", () => {
    for (let i = 1; i < 17; i += 1) {
        it(`Should match the Circomlib Poseidon result with ${i} inputs`, () => {
            const inputs = Array.from({ length: i }, (_, j) => BigInt(j) + 1n)

            const expectedResult = expectedPoseidon(inputs)

            const result = poseidon(inputs)

            expect(result).toBe(expectedResult)
        })

        it(`Should cache the constants (poseidon1)`, () => {
            const inputs = Array.from({ length: i }, (_, j) => BigInt(j) + 1n)

            const expectedResult = expectedPoseidon(inputs)

            ;(p as any)[`poseidon${i}`](inputs, true)
            const result = (p as any)[`poseidon${i}`](inputs)

            expect(result).toBe(expectedResult)
        })
    }

    it(`Should throw an error if the number of inputs is not supported`, () => {
        const inputs = Array.from({ length: 17 }, (_, j) => BigInt(j) + 1n)

        const fun = () => poseidon(inputs)

        expect(fun).toThrow("Input length '17' is not supported")
    })
})
