import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree"
import { poseidon } from "circomlibjs"

/* eslint-disable import/prefer-default-export */
export function createTree(depth: number, numberOfNodes = 0, arity = 2, zeroValue = BigInt(0)): IncrementalMerkleTree {
  const tree = new IncrementalMerkleTree(poseidon, depth, zeroValue, arity)

  for (let i = 0; i < numberOfNodes; i += 1) {
    tree.insert(BigInt(i + 1))
  }

  return tree
}
