import { r } from "@zk-kit/baby-jubjub"
import { poseidon } from "circomlibjs"
import { N_ROUNDS_P, two128 } from "../src/constants"
import { checkEqual, normalize, poseidonPerm, pow5, validateNonce } from "../src/utils"

describe("utils", () => {
    describe("poseidonPerm", () => {
        it("Should produce the same output as circomlibjs", () => {
            const inputs = [BigInt(1), BigInt(2), BigInt(3)]
            const outputCircomlib = poseidon(inputs)
            const outputSelf = poseidonPerm([BigInt(0), ...inputs])
            expect(outputSelf[0]).toStrictEqual(outputCircomlib)
        })
        it("Should produce the same output given the same inputs", () => {
            const inputs = [BigInt(1), BigInt(2), BigInt(3)]
            const output1 = poseidonPerm([BigInt(0), ...inputs])
            const output2 = poseidonPerm([BigInt(0), ...inputs])
            expect(output1).toStrictEqual(output2)
        })
        it("Should throw when given an empty array as input", () => {
            expect(() => poseidonPerm([])).toThrow("Input length must be positive")
        })
        it("Should throw when given an input array of length greater than N_ROUND_P", () => {
            expect(() => poseidonPerm(Array<bigint>(N_ROUNDS_P.length + 1)).fill(BigInt(0))).toThrow(
                "Input length too large"
            )
        })
    })

    describe("checkEqual", () => {
        it("Should throw an error if the values are not equal", () => {
            expect(() => checkEqual(BigInt(1), BigInt(2), "Error")).toThrow("Error")
        })
        it("Should not throw an error if the values are equal", () => {
            expect(() => checkEqual(BigInt(1), BigInt(1), "Error")).not.toThrow("Error")
        })
    })

    describe("validateNonce", () => {
        it("Should throw an error if the nonce is greater than 2^128", () => {
            expect(() => validateNonce(two128 + BigInt(1))).toThrow("The nonce must be less than 2 ^ 128")
        })
        it("Should not throw an error if the nonce is less than 2^128", () => {
            expect(() => validateNonce(two128 - BigInt(1))).not.toThrow("The nonce must be less than 2 ^ 128")
        })
    })

    describe("pow5", () => {
        it("Should return the correct value", () => {
            expect(pow5(BigInt(1))).toBe(BigInt(1))
            expect(pow5(BigInt(2))).toBe(BigInt(32))
            expect(pow5(BigInt(3))).toBe(BigInt(243))
            expect(pow5(BigInt(4))).toBe(BigInt(1024))
            expect(pow5(BigInt(5))).toBe(BigInt(3125))
        })
    })

    describe("normalize", () => {
        it("Should return the correct value", () => {
            expect(normalize(BigInt(-1))).toBe(BigInt(r - BigInt(1)))
            expect(normalize(BigInt(-r))).toBe(BigInt(r))
            expect(normalize(BigInt(0))).toBe(BigInt(0))
            expect(normalize(BigInt(1))).toBe(BigInt(1))
            expect(normalize(BigInt(r))).toBe(BigInt(0))
            expect(normalize(BigInt(r + BigInt(1)))).toBe(BigInt(1))
        })
    })
})
