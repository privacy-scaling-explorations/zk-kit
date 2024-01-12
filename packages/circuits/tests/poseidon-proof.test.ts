import { WitnessTester } from "circomkit"
import { poseidon1, poseidon2 } from "poseidon-lite"
import { circomkit } from "./common"

describe("poseidon-proof", () => {
    let circuit: WitnessTester<["preimage", "scope"], ["digest", "nullifier"]>

    const preimage = 3
    const scope = 2
    const digest = poseidon1([preimage])
    const nullifier = poseidon2([scope, preimage])

    const INPUT = {
        preimage,
        scope
    }

    const OUTPUT = {
        digest,
        nullifier
    }

    before(async () => {
        circuit = await circomkit.WitnessTester("poseidon-proof", {
            file: "poseidon-proof",
            template: "PoseidonProof"
        })
    })

    it("Should compute the hash correctly", async () => {
        await circuit.expectPass(INPUT, OUTPUT)
    })
})
