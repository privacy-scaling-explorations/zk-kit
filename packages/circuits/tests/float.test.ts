import { WitnessTester } from "circomkit"
import { circomkit } from "./common"

describe("float", () => {
    describe("MSB", () => {
        let circuit: WitnessTester<["in"], ["out"]>

        it("Should throw when the number is negative", async () => {
            // Test values
            const inValues = [-1]

            const INPUT = {
                in: inValues
            }

            circuit = await circomkit.WitnessTester("MSB", {
                file: "float",
                template: "MSB",
                params: [2] // Assuming we're working within 2-bit numbers.
            })

            await circuit.expectFail(INPUT)
        })

        it("Should correctly find the most significant bit", async () => {
            // Test values
            const inValues = [1]
            const expectedOut = 0

            const INPUT = {
                in: inValues
            }

            const OUTPUT = {
                out: expectedOut
            }

            circuit = await circomkit.WitnessTester("MSB", {
                file: "float",
                template: "MSB",
                params: [2] // Assuming we're working within 2-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })
    })

    describe("Shift", () => {
        let circuit: WitnessTester<["dividend", "remainder"], ["outDividend", "outRemainder"]>

        // Test values
        const inValues = {
            dividend: 1,
            remainder: 1
        }

        const INPUT = {
            dividend: inValues.dividend,
            remainder: inValues.remainder
        }

        const OUTPUT = {
            outDividend: inValues.dividend,
            outRemainder: inValues.remainder * 2
        }

        before(async () => {
            circuit = await circomkit.WitnessTester("Shift", {
                file: "float",
                template: "Shift",
                params: [2] // Assuming we're working within 2-bit numbers.
            })
        })

        it("Should correctly bit-shifting a dividend and partial remainder", async () => {
            await circuit.expectPass(INPUT, OUTPUT)
        })
    })

    describe("IntegerDivision", () => {
        let circuit: WitnessTester<["a", "b"], ["c"]>

        it("Should throw when trying to perform division per zero [x, 0]", async () => {
            // Test values
            const inValues = {
                a: 10,
                b: 0
            }

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            circuit = await circomkit.WitnessTester("IntegerDivision", {
                file: "float",
                template: "IntegerDivision",
                params: [2] // Assuming we're working within 2-bit numbers.
            })

            await circuit.expectFail(INPUT)
        })

        it("Should throw when trying to perform division per negative number [x, -x]", async () => {
            // Test values
            const inValues = {
                a: 10,
                b: -10
            }

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            circuit = await circomkit.WitnessTester("IntegerDivision", {
                file: "float",
                template: "IntegerDivision",
                params: [2] // Assuming we're working within 2-bit numbers.
            })

            await circuit.expectFail(INPUT)
        })

        it("Should correctly perform the integer division [0, x]", async () => {
            // Test values
            const inValues = {
                a: 0,
                b: 1
            }
            const expectedOut = 0

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            const OUTPUT = {
                c: expectedOut
            }

            circuit = await circomkit.WitnessTester("IntegerDivision", {
                file: "float",
                template: "IntegerDivision",
                params: [2] // Assuming we're working within 2-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })

        it("Should correctly perform the integer division [x, y]", async () => {
            // Test values
            const inValues = {
                a: 10,
                b: 2
            }
            const expectedOut = 5

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            const OUTPUT = {
                c: expectedOut
            }

            circuit = await circomkit.WitnessTester("IntegerDivision", {
                file: "float",
                template: "IntegerDivision",
                params: [10] // Assuming we're working within 10-bit numbers.
            })
            await circuit.expectPass(INPUT, OUTPUT)
        })
    })

    describe("ToFloat", () => {
        let circuit: WitnessTester<["in"], ["out"]>

        // Test values
        const inValues = 10
        const expectedOut = 1000 // 10.00

        const INPUT = {
            in: inValues
        }

        const OUTPUT = {
            out: expectedOut
        }

        before(async () => {
            circuit = await circomkit.WitnessTester("ToFloat", {
                file: "float",
                template: "ToFloat",
                params: [2] // Assuming we're working within the range of 2^2.
            })
        })

        it("Should correctly convert to float", async () => {
            await circuit.expectPass(INPUT, OUTPUT)
        })
    })

    describe("DivisionFromFloat", () => {
        let circuit: WitnessTester<["a", "b"], ["c"]>

        it("Should throw when trying to perform division per zero [x, 0]", async () => {
            // Test values
            const inValues = {
                a: 1,
                b: 0
            }

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            circuit = await circomkit.WitnessTester("DivisionFromFloat", {
                file: "float",
                template: "DivisionFromFloat",
                params: [2, 1] // W decimal digits, N Assuming we're working within 2-bit numbers.
            })

            await circuit.expectFail(INPUT)
        })

        it("Should throw when trying to perform division per negative number [x, -x]", async () => {
            // Test values
            const inValues = {
                a: 1,
                b: -1
            }

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            circuit = await circomkit.WitnessTester("DivisionFromFloat", {
                file: "float",
                template: "DivisionFromFloat",
                params: [2, 1] // W decimal digits, N Assuming we're working within 2-bit numbers.
            })

            await circuit.expectFail(INPUT)
        })

        it("Should correctly perform the integer division [0, x]", async () => {
            // Test values
            const inValues = {
                a: 0,
                b: 1
            }
            const expectedOut = 0

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            const OUTPUT = {
                c: expectedOut
            }

            circuit = await circomkit.WitnessTester("DivisionFromFloat", {
                file: "float",
                template: "DivisionFromFloat",
                params: [2, 1] // W decimal digits, N Assuming we're working within 2-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })

        it("Should correctly perform the integer division [x, y]", async () => {
            // Test values
            const inValues = {
                a: 10,
                b: 2
            }
            const expectedOut = 500

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            const OUTPUT = {
                c: expectedOut
            }

            circuit = await circomkit.WitnessTester("DivisionFromFloat", {
                file: "float",
                template: "DivisionFromFloat",
                params: [2, 31] // W decimal digits, N Assuming we're working within 32-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })
    })

    describe("DivisionFromNormal", () => {
        let circuit: WitnessTester<["a", "b"], ["c"]>

        it("Should throw when trying to perform division per zero [x, 0]", async () => {
            // Test values
            const inValues = {
                a: 1,
                b: 0
            }

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            circuit = await circomkit.WitnessTester("DivisionFromNormal", {
                file: "float",
                template: "DivisionFromNormal",
                params: [2, 1] // W decimal digits, N Assuming we're working within 2-bit numbers.
            })

            await circuit.expectFail(INPUT)
        })

        it("Should throw when trying to perform division per negative number [x, -x]", async () => {
            // Test values
            const inValues = {
                a: 1,
                b: -1
            }

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            circuit = await circomkit.WitnessTester("DivisionFromNormal", {
                file: "float",
                template: "DivisionFromNormal",
                params: [2, 1] // W decimal digits, N Assuming we're working within 2-bit numbers.
            })

            await circuit.expectFail(INPUT)
        })

        it("Should correctly perform the integer division [0, x]", async () => {
            // Test values
            const inValues = {
                a: 0,
                b: 1
            }
            const expectedOut = 0

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            const OUTPUT = {
                c: expectedOut
            }

            circuit = await circomkit.WitnessTester("DivisionFromNormal", {
                file: "float",
                template: "DivisionFromNormal",
                params: [2, 31] // W decimal digits, N Assuming we're working within 32-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })

        it("Should correctly perform the integer division [x, y]", async () => {
            // Test values
            const inValues = {
                a: 10,
                b: 2
            }
            const expectedOut = 500

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            const OUTPUT = {
                c: expectedOut
            }

            circuit = await circomkit.WitnessTester("DivisionFromNormal", {
                file: "float",
                template: "DivisionFromNormal",
                params: [2, 31] // W decimal digits, N Assuming we're working within 32-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })
    })

    describe("MultiplicationFromFloat", () => {
        let circuit: WitnessTester<["a", "b"], ["c"]>

        it("Should throw when trying to perform multiplication per negative number [-x, x]", async () => {
            // Test values
            const inValues = {
                a: -1,
                b: 1
            }

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            circuit = await circomkit.WitnessTester("MultiplicationFromFloat", {
                file: "float",
                template: "MultiplicationFromFloat",
                params: [2, 31] // W decimal digits, N Assuming we're working within 32-bit numbers.
            })

            await circuit.expectFail(INPUT)
        })

        it("Should correctly perform the multiplication from float [0, 0]", async () => {
            // Test values
            const inValues = {
                a: 0,
                b: 0
            }
            const expectedOut = 0

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            const OUTPUT = {
                c: expectedOut
            }

            circuit = await circomkit.WitnessTester("MultiplicationFromFloat", {
                file: "float",
                template: "MultiplicationFromFloat",
                params: [2, 31] // W decimal digits, N Assuming we're working within 32-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })

        it("Should correctly perform the multiplication from float [x, 0]", async () => {
            // Test values
            const inValues = {
                a: 1,
                b: 0
            }
            const expectedOut = 0

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            const OUTPUT = {
                c: expectedOut
            }

            circuit = await circomkit.WitnessTester("MultiplicationFromFloat", {
                file: "float",
                template: "MultiplicationFromFloat",
                params: [2, 31] // W decimal digits, N Assuming we're working within 32-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })

        it("Should correctly perform the multiplication from float [0, x]", async () => {
            // Test values
            const inValues = {
                a: 0,
                b: 1
            }
            const expectedOut = 0

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            const OUTPUT = {
                c: expectedOut
            }

            circuit = await circomkit.WitnessTester("MultiplicationFromFloat", {
                file: "float",
                template: "MultiplicationFromFloat",
                params: [2, 31] // W decimal digits, N Assuming we're working within 32-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })

        it("Should correctly perform the multiplication from float [x, y]", async () => {
            // Test values
            const inValues = {
                a: 10,
                b: 20
            }
            const expectedOut = 2

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            const OUTPUT = {
                c: expectedOut
            }

            circuit = await circomkit.WitnessTester("MultiplicationFromFloat", {
                file: "float",
                template: "MultiplicationFromFloat",
                params: [2, 31] // W decimal digits, N Assuming we're working within 32-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })
    })

    describe("MultiplicationFromNormal", () => {
        let circuit: WitnessTester<["a", "b"], ["c"]>

        it("Should throw when trying to perform multiplication per negative number [-x, x]", async () => {
            // Test values
            const inValues = {
                a: -1,
                b: 1
            }

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            circuit = await circomkit.WitnessTester("MultiplicationFromNormal", {
                file: "float",
                template: "MultiplicationFromNormal",
                params: [2, 31] // W decimal digits, N Assuming we're working within 32-bit numbers.
            })

            await circuit.expectFail(INPUT)
        })

        it("Should correctly perform the multiplication from float [0, 0]", async () => {
            // Test values
            const inValues = {
                a: 0,
                b: 0
            }
            const expectedOut = 0

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            const OUTPUT = {
                c: expectedOut
            }

            circuit = await circomkit.WitnessTester("MultiplicationFromNormal", {
                file: "float",
                template: "MultiplicationFromNormal",
                params: [2, 31] // W decimal digits, N Assuming we're working within 32-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })

        it("Should correctly perform the multiplication from float [x, 0]", async () => {
            // Test values
            const inValues = {
                a: 1,
                b: 0
            }
            const expectedOut = 0

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            const OUTPUT = {
                c: expectedOut
            }

            circuit = await circomkit.WitnessTester("MultiplicationFromNormal", {
                file: "float",
                template: "MultiplicationFromNormal",
                params: [2, 31] // W decimal digits, N Assuming we're working within 32-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })

        it("Should correctly perform the multiplication from float [0, x]", async () => {
            // Test values
            const inValues = {
                a: 0,
                b: 1
            }
            const expectedOut = 0

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            const OUTPUT = {
                c: expectedOut
            }

            circuit = await circomkit.WitnessTester("MultiplicationFromNormal", {
                file: "float",
                template: "MultiplicationFromNormal",
                params: [2, 31] // W decimal digits, N Assuming we're working within 32-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })

        it("Should correctly perform the multiplication from float [x, y]", async () => {
            // Test values
            const inValues = {
                a: 10,
                b: 20
            }
            const expectedOut = 20000

            const INPUT = {
                a: inValues.a,
                b: inValues.b
            }

            const OUTPUT = {
                c: expectedOut
            }

            circuit = await circomkit.WitnessTester("MultiplicationFromNormal", {
                file: "float",
                template: "MultiplicationFromNormal",
                params: [2, 31] // W decimal digits, N Assuming we're working within 32-bit numbers.
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })
    })
})
