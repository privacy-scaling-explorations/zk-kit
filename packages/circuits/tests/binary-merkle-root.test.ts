import { LeanIMT } from "@zk-kit/imt"
import { WitnessTester } from "circomkit"
import { poseidon2 } from "poseidon-lite"
import { circomkit } from "./common"

describe("binary-merkle-root", () => {
    let circuit: WitnessTester<["leaf", "depth", "indices", "siblings"], ["out"]>

    const MAX_DEPTH = 20

    const tree = new LeanIMT((a, b) => poseidon2([a, b]))
    const leaf = BigInt(0)

    tree.insert(leaf)

    for (let i = 1; i < 8; i += 1) {
        tree.insert(BigInt(i))
    }

    const { siblings, index } = tree.generateProof(0)

    // The index must be converted to a list of indices, 1 for each tree level.
    // The circuit tree depth is 20, so the number of siblings must be 20, even if
    // the tree depth is actually 3. The missing siblings can be set to 0, as they
    // won't be used to calculate the root in the circuit.
    const indices = []

    for (let i = 0; i < MAX_DEPTH; i += 1) {
        indices.push((index >> i) & 1)

        if (siblings[i] === undefined) {
            siblings[i] = BigInt(0)
        }
    }

    const INPUT = {
        leaf,
        depth: tree.depth,
        indices,
        siblings
    }

    const OUTPUT = {
        out: tree.root
    }

    before(async () => {
        circuit = await circomkit.WitnessTester("binary-merkle-root", {
            file: "binary-merkle-root",
            template: "BinaryMerkleRoot",
            params: [MAX_DEPTH]
        })
    })

    it("Should calculate the root correctly", async () => {
        await circuit.expectPass(INPUT, OUTPUT)
    })
})
