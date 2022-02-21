import { hexlify } from "@ethersproject/bytes"
import { keccak256 } from "@ethersproject/solidity"
import { toUtf8Bytes } from "@ethersproject/strings"
import { IncrementalMerkleTree, MerkleProof } from "@zk-kit/incremental-merkle-tree"
import { poseidon } from "circomlibjs"
import { ZqField } from "ffjavascript"
import { StrBigInt } from "./types"

export const SNARK_FIELD_SIZE = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617")

export const Fq = new ZqField(SNARK_FIELD_SIZE)

export function genSignalHash(signal: string): bigint {
  const converted = hexlify(toUtf8Bytes(signal))

  return BigInt(keccak256(["bytes"], [converted])) >> BigInt(8)
}

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
 * @param arity The number of leaves per node.
 * @param leaves The list of the leaves of the tree.
 * @returns The Merkle tree.
 */
export function generateMerkleTree(
  depth: number,
  zeroValue: StrBigInt,
  arity: number,
  leaves: StrBigInt[]
): IncrementalMerkleTree {
  const tree = new IncrementalMerkleTree(poseidon, depth, zeroValue, arity)

  for (const leaf of leaves) {
    tree.insert(BigInt(leaf))
  }

  return tree
}

/**
 * Creates a Merkle proof.
 * @param depth The depth of the tree.
 * @param zeroValue The zero value of the tree.
 * @param arity The number of leaves per node.
 * @param leaves The list of the leaves of the tree.
 * @param leafIndex The leaf index for which Merkle proof should be created.
 * @returns The Merkle proof.
 */
export function generateMerkleProof(
  depth: number,
  zeroValue: StrBigInt,
  arity: number,
  leaves: StrBigInt[],
  leaf: StrBigInt
): MerkleProof {
  if (leaf === zeroValue) throw new Error("Can't generate a proof for a zero leaf")

  const tree = generateMerkleTree(depth, zeroValue, arity, leaves)

  const leafIndex = tree.leaves.indexOf(BigInt(leaf))

  if (leafIndex === -1) {
    throw new Error("The leaf does not exists")
  }

  const merkleProof = tree.createProof(leafIndex)

  if (arity === 2) {
    // It makes it compatible with the parameter in the contracts.
    merkleProof.siblings = merkleProof.siblings.map((s) => s[0])
  }

  return merkleProof
}
