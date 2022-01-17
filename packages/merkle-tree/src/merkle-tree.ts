import checkParameter from "./checkParameter"
import { HashFunction, Proof, Node } from "./types"
import IncrementalTree from "./incremental-tree"

/**
 * A Merkle tree is a tree in which every leaf node is labelled with the cryptographic hash of a
 * data block, and every non-leaf node is labelled with the cryptographic hash of the labels of its child nodes.
 * It allows efficient and secure verification of the contents of large data structures.
 * The MerkleTree class is a TypeScript implementation of Merkle tree and it provides all the functions to create
 * efficient trees and to generate and verify proofs of membership.
 */
export default class MerkleTree extends IncrementalTree {
  /**
   * Initializes the Merkle tree with the hash function, the depth and the zero value to use for zeroes.
   * @param hash Hash function.
   * @param depth Tree depth.
   * @param zeroValue Zero values for zeroes.
   */
  constructor(hash: HashFunction, depth: number, zeroValue: Node) {
    super(hash, depth, zeroValue, 2)
  }

  /**
   * Inserts a new leaf in the tree.
   * @param leaf New leaf.
   */
  public insert(leaf: Node) {
    checkParameter(leaf, "leaf", "number", "string", "bigint")

    if (leaf === this._zeroes[0]) {
      throw new Error("The leaf cannot be a zero value")
    }

    if (this.leaves.length >= 2 ** this._depth) {
      throw new Error("The tree is full")
    }

    let node = leaf

    this.forEachLevel(this.leaves.length, (l, i, d) => {
      this._nodes[l][i] = node

      if (d) {
        node = this._hash([node, this._zeroes[l]])
      } else {
        node = this._hash([this._nodes[l][i - 1], node])
      }
    })

    this._root = node
  }

  /**
   * Deletes a leaf from the tree. It does not remove the leaf from
   * the data structure. It set the leaf to be deleted to a zero value.
   * @param index Index of the leaf to be deleted.
   */
  public delete(index: number) {
    checkParameter(index, "index", "number")

    if (index < 0 || index >= this.leaves.length) {
      throw new Error("The leaf does not exist in this tree")
    }

    let node = this._zeroes[0]

    this.forEachLevel(index, (l, i, d) => {
      this._nodes[l][i] = node

      if (d) {
        node = this._hash([node, this._nodes[l][i + 1] || this._zeroes[l]])
      } else {
        node = this._hash([this._nodes[l][i - 1], node])
      }
    })

    this._root = node
  }

  /**
   * Creates a proof of membership.
   * @param index Index of the proof's leaf.
   * @returns Proof object.
   */
  public createProof(index: number): Proof {
    checkParameter(index, "index", "number")

    if (index < 0 || index >= this.leaves.length) {
      throw new Error("The leaf does not exist in this tree")
    }

    const siblingNodes: Node[] = []
    const path: (0 | 1)[] = []

    this.forEachLevel(index, (l, i, d) => {
      if (d) {
        path.push(0)
        siblingNodes.push(this._nodes[l][i + 1] || this._zeroes[l])
      } else {
        path.push(1)
        siblingNodes.push(this._nodes[l][i - 1])
      }
    })

    return { root: this._root, leaf: this.leaves[index], siblingNodes, path }
  }

  /**
   * Verifies a proof and return true or false.
   * @param proof Proof to be verified.
   * @returns True or false.
   */
  public verifyProof(proof: Proof): boolean {
    checkParameter(proof, "proof", "object")
    checkParameter(proof.root, "proof.root", "number", "string", "bigint")
    checkParameter(proof.leaf, "proof.leaf", "number", "string", "bigint")
    checkParameter(proof.siblingNodes, "proof.siblingNodes", "object")
    checkParameter(proof.path, "proof.path", "object")

    let node = proof.leaf

    for (let i = 0; i < proof.siblingNodes.length; i += 1) {
      if (proof.path[i]) {
        node = this._hash([proof.siblingNodes[i], node])
      } else {
        node = this._hash([node, proof.siblingNodes[i]])
      }
    }

    return proof.root === node
  }

  /**
   * Provides a bottom-up tree traversal where for each level it calls a callback.
   * @param index Index of the leaf.
   * @param callback Callback with tree level, index of node in that level and direction (left node: true, right node: false).
   */
  private forEachLevel(index: number, callback: (level: number, index: number, direction: boolean) => void) {
    for (let level = 0; level < this._depth; level += 1) {
      callback(level, index, index % 2 === 0)

      index = Math.floor(index / 2)
    }
  }
}
