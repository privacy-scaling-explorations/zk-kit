import { WitnessTester } from "circomkit"
import { circomkit } from "./common"

describe("safe-comparators", () => {
    describe("SafeLessThan", () => {
        let circuit: WitnessTester<["in"], ["out"]>

        it("Should correctly compare two numbers [x, x]", async () => {
            // Test values
            const inValues = [5, 5] // in[0] === in[1], expecting 'out' to be 0.
            const expectedOut = 0 // Since 5 is equal to 5.

            const INPUT = {
                in: inValues
            }

            const OUTPUT = {
                out: expectedOut
            }

            circuit = await circomkit.WitnessTester("SafeLessThan", {
                file: "safe-comparators",
                template: "SafeLessThan",
                params: [252] // Assuming we're working within 252-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })

        it("Should correctly compare two numbers [x-1, x]", async () => {
            // Test values
            const inValues = [5, 6] // in[0] < in[1], expecting 'out' to be 1.
            const expectedOut = 1 // Since 5 is less than 6.

            const INPUT = {
                in: inValues
            }

            const OUTPUT = {
                out: expectedOut
            }

            circuit = await circomkit.WitnessTester("SafeLessThan", {
                file: "safe-comparators",
                template: "SafeLessThan",
                params: [252] // Assuming we're working within 252-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })

        it("Should correctly compare two numbers [x, x-1]", async () => {
            // Test values
            const inValues = [6, 5] // in[0] > in[1], expecting 'out' to be 0.
            const expectedOut = 0 // Since 6 is greater than 5.

            const INPUT = {
                in: inValues
            }

            const OUTPUT = {
                out: expectedOut
            }

            circuit = await circomkit.WitnessTester("SafeLessThan", {
                file: "safe-comparators",
                template: "SafeLessThan",
                params: [252] // Assuming we're working within 252-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })
    })

    describe("SafeLessEqThan", () => {
        let circuit: WitnessTester<["in"], ["out"]>

        it("Should correctly compare two numbers [x, x]", async () => {
            // Test values
            const inValues = [5, 5] // in[0] === in[1], expecting 'out' to be 1.
            const expectedOut = 1 // Since 5 is equal to 5.

            const INPUT = {
                in: inValues
            }

            const OUTPUT = {
                out: expectedOut
            }

            circuit = await circomkit.WitnessTester("SafeLessEqThan", {
                file: "safe-comparators",
                template: "SafeLessEqThan",
                params: [252] // Assuming we're working within 252-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })

        it("Should correctly compare two numbers [x-1, x]", async () => {
            // Test values
            const inValues = [5, 6] // in[0] < in[1], expecting 'out' to be 1.
            const expectedOut = 1 // Since 5 is less than 6.

            const INPUT = {
                in: inValues
            }

            const OUTPUT = {
                out: expectedOut
            }

            circuit = await circomkit.WitnessTester("SafeLessEqThan", {
                file: "safe-comparators",
                template: "SafeLessEqThan",
                params: [252] // Assuming we're working within 252-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })

        it("Should correctly compare two numbers [x, x-1]", async () => {
            // Test values
            const inValues = [6, 5] // in[0] > in[1], expecting 'out' to be 0.
            const expectedOut = 0 // Since 6 is greater than 5.

            const INPUT = {
                in: inValues
            }

            const OUTPUT = {
                out: expectedOut
            }

            circuit = await circomkit.WitnessTester("SafeLessEqThan", {
                file: "safe-comparators",
                template: "SafeLessEqThan",
                params: [252] // Assuming we're working within 252-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })
    })

    describe("SafeGreaterThan", () => {
        let circuit: WitnessTester<["in"], ["out"]>

        it("Should correctly compare two numbers [x, x]", async () => {
            // Test values
            const inValues = [5, 5] // in[0] === in[1], expecting 'out' to be 0.
            const expectedOut = 0 // Since 5 is equal to 5.

            const INPUT = {
                in: inValues
            }

            const OUTPUT = {
                out: expectedOut
            }

            circuit = await circomkit.WitnessTester("SafeGreaterThan", {
                file: "safe-comparators",
                template: "SafeGreaterThan",
                params: [252] // Assuming we're working within 252-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })

        it("Should correctly compare two numbers [x-1, x]", async () => {
            // Test values
            const inValues = [5, 6] // in[0] < in[1], expecting 'out' to be 0.
            const expectedOut = 0 // Since 5 is less than 6.

            const INPUT = {
                in: inValues
            }

            const OUTPUT = {
                out: expectedOut
            }

            circuit = await circomkit.WitnessTester("SafeGreaterThan", {
                file: "safe-comparators",
                template: "SafeGreaterThan",
                params: [252] // Assuming we're working within 252-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })

        it("Should correctly compare two numbers [x, x-1]", async () => {
            // Test values
            const inValues = [6, 5] // in[0] > in[1], expecting 'out' to be 1.
            const expectedOut = 1 // Since 6 is greater than 5.

            const INPUT = {
                in: inValues
            }

            const OUTPUT = {
                out: expectedOut
            }

            circuit = await circomkit.WitnessTester("SafeGreaterThan", {
                file: "safe-comparators",
                template: "SafeGreaterThan",
                params: [252] // Assuming we're working within 252-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })
    })

    describe("SafeGreaterEqThan", () => {
        let circuit: WitnessTester<["in"], ["out"]>

        it("Should correctly compare two numbers [x, x]", async () => {
            // Test values
            const inValues = [5, 5] // in[0] === in[1], expecting 'out' to be 1.
            const expectedOut = 1 // Since 5 is equal to 5.

            const INPUT = {
                in: inValues
            }

            const OUTPUT = {
                out: expectedOut
            }

            circuit = await circomkit.WitnessTester("SafeGreaterEqThan", {
                file: "safe-comparators",
                template: "SafeGreaterEqThan",
                params: [252] // Assuming we're working within 252-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })

        it("Should correctly compare two numbers [x-1, x]", async () => {
            // Test values
            const inValues = [5, 6] // in[0] < in[1], expecting 'out' to be 0.
            const expectedOut = 0 // Since 5 is less than 6.

            const INPUT = {
                in: inValues
            }

            const OUTPUT = {
                out: expectedOut
            }

            circuit = await circomkit.WitnessTester("SafeGreaterEqThan", {
                file: "safe-comparators",
                template: "SafeGreaterEqThan",
                params: [252] // Assuming we're working within 252-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })

        it("Should correctly compare two numbers [x, x-1]", async () => {
            // Test values
            const inValues = [6, 5] // in[0] > in[1], expecting 'out' to be 1.
            const expectedOut = 1 // Since 6 is greater than 5.

            const INPUT = {
                in: inValues
            }

            const OUTPUT = {
                out: expectedOut
            }

            circuit = await circomkit.WitnessTester("SafeGreaterEqThan", {
                file: "safe-comparators",
                template: "SafeGreaterEqThan",
                params: [252] // Assuming we're working within 252-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })
    })
})
