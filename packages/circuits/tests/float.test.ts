import { WitnessTester } from "circomkit"
import { circomkit } from "./common"

describe("float", () => {
    describe("MSB", () => {
        let circuit: WitnessTester<["in"], ["out"]>

        // Test values
        const inValues = [1000]
        const expectedOut = 0

        const INPUT = {
            in: inValues
        }

        const OUTPUT = {
            out: expectedOut
        }

        before(async () => {
            circuit = await circomkit.WitnessTester("MSB", {
                file: "float",
                template: "MSB",
                params: [252] // Assuming we're working within 252-bit numbers.
            })
        })

        it("Should correctly find the most significant bit", async () => {
            await circuit.expectPass(INPUT, OUTPUT)
        })
    })

    describe("Shift", () => {
        let circuit: WitnessTester<["divident", "rem"], ["divident1", "rem1"]>

        // Test values
        const inValues = {
            divident: 10,
            rem: 1
        }

        const INPUT = {
            divident: inValues.divident,
            rem: inValues.rem
        }

        const OUTPUT = {
            divident1: inValues.divident,
            rem1: inValues.rem * 2
        }

        before(async () => {
            circuit = await circomkit.WitnessTester("Shift", {
                file: "float",
                template: "Shift",
                params: [252] // Assuming we're working within 252-bit numbers.
            })
        })

        it("Should correctly bit-shifting a dividend and partial remainder", async () => {
            await circuit.expectPass(INPUT, OUTPUT)
        })
    })

    describe("IntegerDivision", () => {
        let circuit: WitnessTester<["a", "b"], ["c"]>

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

        before(async () => {
            circuit = await circomkit.WitnessTester("IntegerDivision", {
                file: "float",
                template: "IntegerDivision",
                params: [252] // Assuming we're working within 252-bit numbers.
            })
        })

        it("Should correctly perform the integer division", async () => {
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
                params: [2] // Assuming we're working within the range of 2^252.
            })
        })

        it("Should correctly convert to float", async () => {
            await circuit.expectPass(INPUT, OUTPUT)
        })
    })

    describe("DivisionFromFloat", () => {
        let circuit: WitnessTester<["a", "b"], ["c"]>

        // Test values
        const inValues = {
            a: 1000, // 10.00
            b: 200 // 2.00
        }
        const expectedOut = 500 // 5.00

        const INPUT = {
            a: inValues.a,
            b: inValues.b
        }

        const OUTPUT = {
            c: expectedOut
        }

        before(async () => {
            circuit = await circomkit.WitnessTester("DivisionFromFloat", {
                file: "float",
                template: "DivisionFromFloat",
                params: [2, 251] // W decimal digits, N Assuming we're working within 252-bit numbers.
            })
        })

        it("Should correctly perform the division from float", async () => {
            await circuit.expectPass(INPUT, OUTPUT)
        })
    })

    describe("DivisionFromNormal", () => {
        let circuit: WitnessTester<["a", "b"], ["c"]>

        // Test values
        const inValues = {
            a: 10,
            b: 2
        }
        const expectedOut = 500 // 5.00

        const INPUT = {
            a: inValues.a,
            b: inValues.b
        }

        const OUTPUT = {
            c: expectedOut
        }

        before(async () => {
            circuit = await circomkit.WitnessTester("DivisionFromNormal", {
                file: "float",
                template: "DivisionFromNormal",
                params: [2, 251] // W decimal digits, N Assuming we're working within 252-bit numbers.
            })
        })

        it("Should correctly perform the division from normal", async () => {
            await circuit.expectPass(INPUT, OUTPUT)
        })
    })

    describe("MultiplicationFromFloat", () => {
        let circuit: WitnessTester<["a", "b"], ["c"]>

        // Test values
        const inValues = {
            a: 1000, // 10.00
            b: 200 // 2.00
        }
        const expectedOut = 2000 // 20.00

        const INPUT = {
            a: inValues.a,
            b: inValues.b
        }

        const OUTPUT = {
            c: expectedOut
        }

        before(async () => {
            circuit = await circomkit.WitnessTester("MultiplicationFromFloat", {
                file: "float",
                template: "MultiplicationFromFloat",
                params: [2, 251] // W decimal digits, N Assuming we're working within 252-bit numbers.
            })
        })

        it("Should correctly perform the multiplication from float", async () => {
            await circuit.expectPass(INPUT, OUTPUT)
        })
    })

    describe("MultiplicationFromNormal", () => {
        let circuit: WitnessTester<["a", "b"], ["c"]>

        // Test values
        const inValues = {
            a: 10,
            b: 2
        }
        const expectedOut = 2000 // 20.00

        const INPUT = {
            a: inValues.a,
            b: inValues.b
        }

        const OUTPUT = {
            c: expectedOut
        }

        before(async () => {
            circuit = await circomkit.WitnessTester("MultiplicationFromNormal", {
                file: "float",
                template: "MultiplicationFromNormal",
                params: [2, 251] // W decimal digits, N Assuming we're working within 252-bit numbers.
            })
        })

        it("Should correctly perform the multiplication from normal", async () => {
            await circuit.expectPass(INPUT, OUTPUT)
        })
    })
})
