import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree"
import { MerkleProof } from "@zk-kit/types"
import { poseidon } from "circomlibjs"
import * as ethers from "ethers"
import { ZqField } from "ffjavascript"

export const SNARK_FIELD_SIZE = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617")

export const Fq = new ZqField(SNARK_FIELD_SIZE)

type IncrementalQuinTree = any

export const poseidonHash = (data: Array<bigint>): bigint => poseidon(data)

export const genSignalHash = (signal: string): bigint => {
  const converted = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(signal))
  return BigInt(ethers.utils.solidityKeccak256(["bytes"], [converted])) >> BigInt(8)
}

export const genExternalNullifier = (plaintext: string): string => {
  const _cutOrExpandHexToBytes = (hexStr: string, bytes: number): string => {
    const len = bytes * 2

    const h = hexStr.slice(2, len + 2)
    return `0x${h.padStart(len, "0")}`
  }

  const hashed = ethers.utils.solidityKeccak256(["string"], [plaintext])
  return _cutOrExpandHexToBytes(`0x${hashed.slice(8)}`, 32)
}

export const createTree = (depth: number, zeroValue: number | BigInt, arity: number): IncrementalQuinTree =>
  new IncrementalMerkleTree(poseidonHash, depth, zeroValue, arity)

/**
 * Creates merkle proof
 * @param depth depth of tree
 * @param zeroValue zero value of tree
 * @param leavesPerNode number of leaves to derive hash from
 * @param leaves leaves to build try from
 * @param leaf leaf for which merkle proof should be generated
 * @returns merkle proof
 */
export const generateMerkleProof = (
  depth: number,
  zeroValue: number | BigInt,
  arity: number,
  leaves: Array<bigint | string>,
  leaf: bigint | string
): MerkleProof => {
  const tree: IncrementalQuinTree = new IncrementalMerkleTree(poseidonHash, depth, zeroValue, arity)
  const leafIndex = leaves.indexOf(leaf)
  if (leafIndex === -1) throw new Error("Leaf does not exists")

  for (const leaf of leaves) {
    tree.insert(leaf)
  }

  return tree.createProof(leafIndex)
}
