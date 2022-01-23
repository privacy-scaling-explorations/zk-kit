import b from "benny"
import { poseidon } from "circomlibjs"
import { IncrementalQuinTree } from "incrementalquintree"
import { IncrementalMerkleTree } from "../packages/incremental-merkle-tree/src"

const name = "incremental-merkle-tree"

export default async function run() {
  const tree1 = new IncrementalMerkleTree(poseidon, 20, BigInt(0), 5)
  const tree2 = new IncrementalQuinTree(20, BigInt(0), 5, poseidon)

  const numberOfLeaves = 2 ** 7

  for (let i = 0; i < numberOfLeaves; i += 1) {
    tree1.insert(BigInt(i + 1))
    tree2.insert(BigInt(i + 1))
  }

  b.suite(
    name,

    b.add(`IncrementalMerkleTree - createProof (${numberOfLeaves} leaves)`, () => {
      for (let i = 0; i < numberOfLeaves; i += 1) {
        tree1.createProof(i)
      }
    }),

    b.add(`IncrementalQuinTree - genMerklePath (${numberOfLeaves} leaves)`, () => {
      for (let i = 0; i < numberOfLeaves; i += 1) {
        tree2.genMerklePath(i)
      }
    }),

    b.cycle(),
    b.complete(),

    b.save({ folder: "benchmarks/results", file: name, version: "1.0.0", details: true }),
    b.save({ folder: "benchmarks/results", file: name, format: "chart.html", details: true }),
    b.save({ folder: "benchmarks/results", file: name, format: "table.html", details: true })
  )
}
