import b from "benny"
import { poseidon } from "circomlibjs"
import { IncrementalQuinTree } from "incrementalquintree"
import { IncrementalMerkleTree } from "../packages/incremental-merkle-tree/src"

const name = "incremental-merkle-tree"

export default async function run() {
  const newTree = new IncrementalMerkleTree(poseidon, 20, BigInt(0), 2)
  const oldTree = new IncrementalQuinTree(20, BigInt(0), 2, poseidon)

  const numberOfLeaves = 2 ** 4

  b.suite(
    name,

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

    b.save({ folder: "benchmarks/results", file: name, version: "1.0.0", details: true }),
    b.save({ folder: "benchmarks/results", file: name, format: "chart.html", details: true }),
    b.save({ folder: "benchmarks/results", file: name, format: "table.html", details: true })
  )
}
