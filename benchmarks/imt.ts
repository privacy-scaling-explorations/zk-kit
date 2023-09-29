import b from "benny"
import { poseidon2 } from "poseidon-lite"
import { IMT, LeanIMT } from "../packages/imt/src"

const name = "incremental-merkle-trees"

export default async function run() {
    const treeDepth = 7
    const numberOfLeaves = 2 ** treeDepth

    b.suite(
        name,

        b.add(`IMT - Insert ${numberOfLeaves} leaves`, () => {
            const tree1 = new IMT(poseidon2, treeDepth, 0, 2)

            for (let i = 0; i < numberOfLeaves; i += 1) {
                tree1.insert(i)
            }
        }),
        b.add(`LeanIMT - Insert ${numberOfLeaves} leaves`, () => {
            const tree2 = new LeanIMT((a, b) => poseidon2([a, b]))

            for (let i = 0; i < numberOfLeaves; i += 1) {
                tree2.insert(BigInt(i))
            }
        }),

        b.cycle(),
        b.complete(),

        b.save({ folder: "benchmarks/results", file: name, version: "1.0.0", details: true }),
        b.save({ folder: "benchmarks/results", file: name, format: "chart.html", details: true }),
        b.save({ folder: "benchmarks/results", file: name, format: "table.html", details: true })
    )
}
