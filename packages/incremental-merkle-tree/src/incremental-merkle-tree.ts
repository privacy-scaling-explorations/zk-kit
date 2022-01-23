import { MerkleProof } from "@zk-kit/types"
import checkParameter from "./checkParameter"
import { HashFunction, Node } from "./types"

/**
 * A Merkle tree is a tree in which every leaf node is labelled with the cryptographic hash of a
 * data block, and every non-leaf node is labelled with the cryptographic hash of the labels of its child nodes.
 * It allows efficient and secure verification of the contents of large data structures.
 * The IncrementalMerkleTree class is a TypeScript implementation of Incremental Merkle tree and it
 * provides all the functions to create efficient trees and to generate and verify proofs of membership.
 */
export default class IncrementalMerkleTree {
  static readonly maxDepth = 32

  private _root: Node
  private readonly _nodes: Node[][]
  private readonly _zeroes: Node[]
  private readonly _hash: HashFunction
  private readonly _depth: number
  private readonly _arity: number

  /**
   * Initializes the tree with the hash function, the depth, the zero value to use for zeroes
   * and the arity (i.e. the number of children for each node).
   * @param hash Hash function.
   * @param depth Tree depth.
   * @param zeroValue Zero values for zeroes.
   * @param arity The number of children for each node.
   */
  constructor(hash: HashFunction, depth: number, zeroValue: Node, arity = 2) {
    checkParameter(hash, "hash", "function")
    checkParameter(depth, "depth", "number")
    checkParameter(zeroValue, "zeroValue", "number", "string", "bigint")
    checkParameter(arity, "arity", "number")

    if (depth < 1 || depth > IncrementalMerkleTree.maxDepth) {
      throw new Error("The tree depth must be between 1 and 32")
    }

    // Initialize the attributes.
    this._hash = hash
    this._depth = depth
    this._zeroes = []
    this._nodes = []
    this._arity = arity

    for (let i = 0; i < depth; i += 1) {
      this._zeroes.push(zeroValue)
      this._nodes[i] = []
      // There must be a zero value for each tree level (except the root).
      zeroValue = hash(Array(this._arity).fill(zeroValue))
    }

    // The default root is the last zero value.
    this._root = zeroValue

    // Freeze the array objects. It prevents unintentional changes.
    Object.freeze(this._zeroes)
    Object.freeze(this._nodes)
  }

  /**
   * Returns the root hash of the tree.
   * @returns Root hash.
   */
  public get root(): Node {
    return this._root
  }

  /**
   * Returns the depth of the tree.
   * @returns Tree depth.
   */
  public get depth(): number {
    return this._depth
  }

  /**
   * Returns the leaves of the tree.
   * @returns List of leaves.
   */
  public get leaves(): Node[] {
    return this._nodes[0].slice()
  }

  /**
   * Returns the zeroes nodes of the tree.
   * @returns List of zeroes.
   */
  public get zeroes(): Node[] {
    return this._zeroes
  }

  /**
   * Returns the number of children for each node.
   * @returns Number of children per node.
   */
  public get arity(): number {
    return this._arity
  }

  /**
   * Returns the index of a leaf. If the leaf does not exist it returns -1.
   * @param leaf Tree leaf.
   * @returns Index of the leaf.
   */
  public indexOf(leaf: Node): number {
    checkParameter(leaf, "leaf", "number", "string", "bigint")

    return this.leaves.indexOf(leaf)
  }

  /**
   * Inserts a new leaf in the tree.
   * @param leaf New leaf.
   */
  public insert(leaf: Node) {
    checkParameter(leaf, "leaf", "number", "string", "bigint")

    if (leaf === this.zeroes[0]) {
      throw new Error("The leaf cannot be a zero value")
    }

    if (this.leaves.length >= this.arity ** this.depth) {
      throw new Error("The tree is full")
    }

    let node = leaf

    this.forEachLevel(this.leaves.length, (level, index, position) => {
      this._nodes[level][index] = node
      const children = []
      const levelStartIndex = index - position
      const levelEndIndex = levelStartIndex + this._arity

      for (let i = levelStartIndex; i < levelEndIndex; i += 1) {
        if (i < this._nodes[level].length) {
          children.push(this._nodes[level][i])
        } else {
          children.push(this.zeroes[level])
        }
      }

      node = this._hash(children)
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

    this.forEachLevel(index, (level, index, position) => {
      this._nodes[level][index] = node
      const children = []
      const levelStartIndex = index - position
      const levelEndIndex = levelStartIndex + this._arity

      for (let i = levelStartIndex; i < levelEndIndex; i += 1) {
        if (i < this._nodes[level].length) {
          children.push(this._nodes[level][i])
        } else {
          children.push(this.zeroes[level])
        }
      }

      node = this._hash(children)
    })

    this._root = node
  }

  /**
   * Creates a proof of membership.
   * @param index Index of the proof's leaf.
   * @returns Proof object.
   */
  public createProof(index: number): MerkleProof {
    checkParameter(index, "index", "number")

    if (index < 0 || index >= this.leaves.length) {
      throw new Error("The leaf does not exist in this tree")
    }

    const siblings: Node[][] = []
    const pathIndices: number[] = []

    this.forEachLevel(index, (level, index, position) => {
      pathIndices[level] = position
      siblings[level] = []
      const levelStartIndex = index - position
      const levelEndIndex = levelStartIndex + this._arity

      for (let i = levelStartIndex; i < levelEndIndex; i += 1) {
        if (i !== index) {
          if (i < this._nodes[level].length) {
            siblings[level].push(this._nodes[level][i])
          } else {
            siblings[level].push(this.zeroes[level])
          }
        }
      }
    })

    return { root: this._root, leaf: this.leaves[index], pathIndices, siblings }
  }

  /**
   * Verifies a proof and return true or false.
   * @param proof Proof to be verified.
   * @returns True or false.
   */
  public verifyProof(proof: MerkleProof): boolean {
    checkParameter(proof, "proof", "object")
    checkParameter(proof.root, "proof.root", "number", "string", "bigint")
    checkParameter(proof.leaf, "proof.leaf", "number", "string", "bigint")
    checkParameter(proof.siblings, "proof.siblings", "object")
    checkParameter(proof.pathIndices, "proof.pathElements", "object")

    let node = proof.leaf

    for (let i = 0; i < proof.siblings.length; i += 1) {
      proof.siblings[i].splice(proof.pathIndices[i], 0, node)

      node = this._hash(proof.siblings[i])
    }

    return proof.root === node
  }

  /**
   * Provides a bottom-up tree traversal where for each level it calls a callback.
   * @param index Index of the leaf.
   * @param callback Callback with tree level, index of node in that level and position.
   */
  private forEachLevel(index: number, callback: (level: number, index: number, position: number) => void) {
    for (let level = 0; level < this.depth; level += 1) {
      callback(level, index, index % this.arity)

      index = Math.floor(index / this.arity)
    }
  }
}
