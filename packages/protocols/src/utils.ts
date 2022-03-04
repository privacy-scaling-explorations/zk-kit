import { keccak256 } from "@ethersproject/solidity"
import { IncrementalMerkleTree, MerkleProof } from "@zk-kit/incremental-merkle-tree"
import { poseidon } from "circomlibjs"
import { ZqField } from "ffjavascript"
import { StrBigInt } from "./types"

export const SNARK_FIELD_SIZE = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617")

export const Fq = new ZqField(SNARK_FIELD_SIZE)

export function genExternalNullifier(plaintext: string): string {
  const hashed = keccak256(["string"], [plaintext])
  const hexStr = `0x${hashed.slice(8)}`
  const len = 32 * 2
  const h = hexStr.slice(2, len + 2)

  return `0x${h.padStart(len, "0")}`
}

/**
 * Creates a Merkle tree.
 * @param depth The depth of the tree.
 * @param zeroValue The zero value of the tree.
 * @param leaves The list of the leaves of the tree.
 * @returns The Merkle tree.
 */
export function generateMerkleTree(depth: number, zeroValue: StrBigInt, leaves: StrBigInt[]): IncrementalMerkleTree {
  const tree = new IncrementalMerkleTree(poseidon, depth, zeroValue, 2)

  for (const leaf of leaves) {
    tree.insert(BigInt(leaf))
  }

  return tree
}

/**
 * Creates a Merkle proof.
 * @param depth The depth of the tree.
 * @param zeroValue The zero value of the tree.
 * @param leaves The list of the leaves of the tree.
 * @param leaf The leaf for which Merkle proof should be created.
 * @returns The Merkle proof.
 */
export function generateMerkleProof(
  depth: number,
  zeroValue: StrBigInt,
  leaves: StrBigInt[],
  leaf: StrBigInt
): MerkleProof {
  if (leaf === zeroValue) throw new Error("Can't generate a proof for a zero leaf")

  const tree = generateMerkleTree(depth, zeroValue, leaves)

  const leafIndex = tree.leaves.indexOf(BigInt(leaf))

  if (leafIndex === -1) {
    throw new Error("The leaf does not exists")
  }

  const merkleProof = tree.createProof(leafIndex)

  merkleProof.siblings = merkleProof.siblings.map((s) => s[0])

  return merkleProof
}
