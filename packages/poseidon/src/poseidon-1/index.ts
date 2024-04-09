import poseidonBasic from "../poseidon-basic"
import { FixedArray } from "../types"
import { mds, roundConstants } from "./constants"

export default function poseidon1(input: FixedArray<bigint, 1>) {
    return poseidonBasic(1, roundConstants, mds)([0n, ...input])[0]
}
