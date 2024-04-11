import b from "benny"
import { poseidon2 as _poseidon2 } from "poseidon-lite"
import { poseidon as _poseidon } from "circomlibjs"
import { poseidon2 } from "@zk-kit/poseidon"

const name = "poseidon"

export default async function run() {
    const numberOfHashes = 50

    b.suite(
        name,

        b.add(`PoseidonLite - ${numberOfHashes} hashes`, () => {
            for (let i = 0; i < numberOfHashes; i += 1) {
                _poseidon2([1n, 2n])
            }
        }),
        b.add(`CircomlibJS Poseidon - ${numberOfHashes} hashes`, () => {
            for (let i = 0; i < numberOfHashes; i += 1) {
                _poseidon([1n, 2n])
            }
        }),
        b.add(`ZK-Kit Poseidon - ${numberOfHashes} hashes`, () => {
            for (let i = 0; i < numberOfHashes; i += 1) {
                poseidon2([1n, 2n])
            }
        }),

        b.cycle(),
        b.complete(),

        b.save({ folder: "benchmarks/results", file: name, version: "1.0.0", details: true }),
        b.save({ folder: "benchmarks/results", file: name, format: "chart.html", details: true }),
        b.save({ folder: "benchmarks/results", file: name, format: "table.html", details: true })
    )
}
