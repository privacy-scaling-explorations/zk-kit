import poseidon1 from "./poseidon-1"
import poseidon2 from "./poseidon-2"
import { FixedArray } from "./types"

export default function poseidon(input: bigint[]) {
    switch (input.length) {
        case 1:
            return poseidon1(input as FixedArray<bigint, 1>)
        case 2:
            return poseidon2(input as FixedArray<bigint, 2>)
        default:
            throw new Error(`Input length '${input.length}' is not supported`)
    }
}
