import { WitnessTester } from "circomkit"
import { poseidon3 } from "poseidon-lite"
import { circomkit } from "./common"

describe("poseidon-proof", () => {
    let circuit: WitnessTester<["preimages", "scope"], ["digest"]>

    it("Should throw an error if no preimages are provided", async () => {
        const numberOfInputs = 1
        const preimages: any = []
        const scope = 2

        const INPUT = {
            preimages,
            scope
        }

        circuit = await circomkit.WitnessTester("poseidon-proof", {
            file: "poseidon-proof",
            template: "PoseidonProof",
            params: [numberOfInputs]
        })

        await circuit.expectFail(INPUT)
    })

    it("Should throw an error if the number of preimages is incorrect", async () => {
        const numberOfInputs = 1
        const preimages: any = [1, 2, 3]
        const scope = 2

        const INPUT = {
            preimages,
            scope
        }

        circuit = await circomkit.WitnessTester("poseidon-proof", {
            file: "poseidon-proof",
            template: "PoseidonProof",
            params: [numberOfInputs]
        })

        await circuit.expectFail(INPUT)
    })

    it("Should throw an error if scope is negative", async () => {
        const numberOfInputs = 1
        const preimages: any = [1, 2, 3]
        const scope = -2

        const INPUT = {
            preimages,
            scope
        }

        circuit = await circomkit.WitnessTester("poseidon-proof", {
            file: "poseidon-proof",
            template: "PoseidonProof",
            params: [numberOfInputs]
        })

        await circuit.expectFail(INPUT)
    })

    it("Should calculate the hash correctly", async () => {
        const numberOfInputs = 3
        const preimages = [1, 2, 3]
        const scope = 2
        const digest = poseidon3(preimages)

        const INPUT = {
            preimages,
            scope
        }

        const OUTPUT = {
            digest
        }

        circuit = await circomkit.WitnessTester("poseidon-proof", {
            file: "poseidon-proof",
            template: "PoseidonProof",
            params: [numberOfInputs]
        })

        await circuit.expectPass(INPUT, OUTPUT)
    })

    it("Should calculate the hash correctly if one or more preimages are negative", async () => {
        const numberOfInputs = 3
        const preimages: any = [-1, 2, -3]
        const scope = 2
        const digest = poseidon3(preimages)

        const INPUT = {
            preimages,
            scope
        }

        const OUTPUT = {
            digest
        }

        circuit = await circomkit.WitnessTester("poseidon-proof", {
            file: "poseidon-proof",
            template: "PoseidonProof",
            params: [numberOfInputs]
        })

        await circuit.expectPass(INPUT, OUTPUT)
    })
})
