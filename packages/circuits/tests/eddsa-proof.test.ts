import { WitnessTester } from "circomkit"
import { poseidon2 } from "poseidon-lite"
import { deriveSecretScalar, derivePublicKey } from "@zk-kit/eddsa-poseidon"
import { circomkit } from "./common"

describe("eddsa-proof", () => {
    let circuit: WitnessTester<["privateKey", "scope"], ["commitment", "nullifier"]>

    const privateKey = 3
    const scope = 2

    const publicKey = derivePublicKey(privateKey)
    const commitment = poseidon2(publicKey)

    const nullifier = poseidon2([scope, commitment])

    const INPUT = {
        privateKey: BigInt(deriveSecretScalar(privateKey)),
        scope
    }

    const OUTPUT = {
        commitment,
        nullifier
    }

    before(async () => {
        circuit = await circomkit.WitnessTester("poseidon-proof", {
            file: "eddsa-proof",
            template: "EddsaProof"
        })
    })

    it("Should compute hash correctly", async () => {
        await circuit.expectPass(INPUT, OUTPUT)
    })
})
