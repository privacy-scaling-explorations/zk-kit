import { WitnessTester } from "circomkit"
import { circomkit } from "./common"

describe("safe-comparators", () => {
    describe("SafeLessThan", () => {
        let circuit: WitnessTester<["in"], ["out"]>

        // Test values
        const inValues = [5, 10] // in[0] < in[1], expecting 'out' to be 1.
        const expectedOut = 1 // Since 5 is less than 10.

        const INPUT = {
            in: inValues
        }

        const OUTPUT = {
            out: expectedOut
        }

        before(async () => {
            circuit = await circomkit.WitnessTester("SafeLessThan", {
                file: "safe-comparators",
                template: "SafeLessThan",
                params: [252] // Assuming we're working within 252-bit numbers.
            })
        })

        it("Should correctly compare two numbers", async () => {
            await circuit.expectPass(INPUT, OUTPUT)
        })
    })

    describe("SafeLessEqThan", () => {
        let circuit: WitnessTester<["in"], ["out"]>

        // Test values
        const inValues = [5, 5] // in[0] === in[1], expecting 'out' to be 1.
        const expectedOut = 1 // Since 5 is equal to 5.

        const INPUT = {
            in: inValues
        }

        const OUTPUT = {
            out: expectedOut
        }

        before(async () => {
            circuit = await circomkit.WitnessTester("SafeLessEqThan", {
                file: "safe-comparators",
                template: "SafeLessEqThan",
                params: [252] // Assuming we're working within 252-bit numbers.
            })
        })

        it("Should correctly compare two numbers", async () => {
            await circuit.expectPass(INPUT, OUTPUT)
        })
    })

    describe("SafeGreaterThan", () => {
        let circuit: WitnessTester<["in"], ["out"]>

        // Test values
        const inValues = [10, 5] // in[0] > in[1], expecting 'out' to be 1.
        const expectedOut = 1 // Since 10 is greater than 5.

        const INPUT = {
            in: inValues
        }

        const OUTPUT = {
            out: expectedOut
        }

        before(async () => {
            circuit = await circomkit.WitnessTester("SafeGreaterThan", {
                file: "safe-comparators",
                template: "SafeGreaterThan",
                params: [252] // Assuming we're working within 252-bit numbers.
            })
        })

        it("Should correctly compare two numbers", async () => {
            await circuit.expectPass(INPUT, OUTPUT)
        })
    })

    describe("SafeGreaterEqThan", () => {
        let circuit: WitnessTester<["in"], ["out"]>

        // Test values
        const inValues = [5, 5] // in[0] === in[1], expecting 'out' to be 1.
        const expectedOut = 1 // Since 5 is equal to 5.

        const INPUT = {
            in: inValues
        }

        const OUTPUT = {
            out: expectedOut
        }

        before(async () => {
            circuit = await circomkit.WitnessTester("SafeGreaterEqThan", {
                file: "safe-comparators",
                template: "SafeGreaterEqThan",
                params: [252] // Assuming we're working within 252-bit numbers.
            })
        })

        it("Should correctly compare two numbers", async () => {
            await circuit.expectPass(INPUT, OUTPUT)
        })
    })
})
