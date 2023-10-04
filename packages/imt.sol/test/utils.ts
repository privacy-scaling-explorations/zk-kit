import { IMT } from "@zk-kit/imt"
import { poseidon2, poseidon5 } from "poseidon-lite"

/* eslint-disable import/prefer-default-export */
export function createTree(depth: number, numberOfNodes = 0, arity = 2, zeroValue = BigInt(0)): IMT {
    const poseidon = arity === 2 ? poseidon2 : poseidon5

    const tree = new IMT(poseidon, depth, zeroValue, arity)

    for (let i = 0; i < numberOfNodes; i += 1) {
        tree.insert(BigInt(i + 1))
    }

    return tree
}
