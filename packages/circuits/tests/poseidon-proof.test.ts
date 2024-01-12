import { WitnessTester } from "circomkit"
import { poseidon2, poseidon3 } from "poseidon-lite"
import { circomkit } from "./common"

describe("poseidon-proof", () => {
    let circuit: WitnessTester<["preimages", "scope"], ["digest", "nullifier"]>

    const numberOfInputs = 3
    const preimages = [1, 2, 3]
    const scope = 2
    const digest = poseidon3(preimages)
    const nullifier = poseidon2([scope, digest])

    const INPUT = {
        preimages,
        scope
    }

    const OUTPUT = {
        digest,
        nullifier
    }

    before(async () => {
        circuit = await circomkit.WitnessTester("poseidon-proof", {
            file: "poseidon-proof",
            template: "PoseidonProof",
            params: [numberOfInputs]
        })
    })

    it("Should compute hash correctly", async () => {
        await circuit.expectPass(INPUT, OUTPUT)
    })
})
