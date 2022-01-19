import b from "benny"
import { poseidon } from "circomlibjs"
import { IncrementalQuinTree } from "incrementalquintree"
import { IncrementalMerkleTree } from "../src"

const newTree = new IncrementalMerkleTree(poseidon, 20, BigInt(0), 2)
const oldTree = new IncrementalQuinTree(20, BigInt(0), 2, poseidon)

const numberOfLeaves = 2 ** 4

b.suite(
  "Incremental Merkle tree benchmarks",

  b.add("Generate proof for new tree", () => {
    for (let i = 0; i < numberOfLeaves; i += 1) {
      newTree.insert(BigInt(i + 1))
    }

    for (let i = 0; i < numberOfLeaves; i += 1) {
      newTree.createProof(i)
    }
  }),

  b.add("Generate proof for old tree", () => {
    for (let i = 0; i < numberOfLeaves; i += 1) {
      oldTree.insert(BigInt(i + 1))
    }

    for (let i = 0; i < numberOfLeaves; i += 1) {
      oldTree.genMerklePath(i)
    }
  }),

  b.cycle(),
  b.complete(),

  b.save({ file: "reduce", version: "1.0.0", details: true }),
  b.save({ file: "reduce", format: "chart.html", details: true })
)
