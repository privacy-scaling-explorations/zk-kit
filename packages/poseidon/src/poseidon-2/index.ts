import poseidonBasic from "../poseidon-basic"
import { FixedArray } from "../types"
import { mds, roundConstants } from "./constants"

export default function poseidon2(input: FixedArray<bigint, 2>) {
    return poseidonBasic(2, roundConstants, mds)([0n, ...input])[0]
}
