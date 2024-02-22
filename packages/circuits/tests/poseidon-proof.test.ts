import { WitnessTester } from "circomkit"
import { poseidon3 } from "poseidon-lite"
import { circomkit } from "./common"

describe("poseidon-proof", () => {
    let circuit: WitnessTester<["preimages", "scope"], ["digest"]>

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

    before(async () => {
        circuit = await circomkit.WitnessTester("poseidon-proof", {
            file: "poseidon-proof",
            template: "PoseidonProof",
            params: [numberOfInputs]
        })
    })

    it("Should compute the hash correctly", async () => {
        await circuit.expectPass(INPUT, OUTPUT)
    })
})
