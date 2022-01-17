import checkParameter from "./checkParameter"
import { HashFunction, Proof, Node } from "./types"

/**
 * A Merkle tree is a tree in which every leaf node is labelled with the cryptographic hash of a
 * data block, and every non-leaf node is labelled with the cryptographic hash of the labels of its child nodes.
 * It allows efficient and secure verification of the contents of large data structures.
 * The MerkleTree class is a TypeScript implementation of Merkle tree and it provides all the functions to create
 * efficient trees and to generate and verify proofs of membership.
 */
export default class IncrementalMerkleTree {
  static readonly maxDepth = 32

  protected _root: Node
  protected readonly _nodes: Node[][]
  protected readonly _zeroes: Node[]
  protected readonly _hash: HashFunction
  protected readonly _depth: number
  protected readonly _arity: number

  /**
   * Initializes the Merkle tree with the hash function, the depth and the zero value to use for zeroes.
   * @param hash Hash function.
   * @param depth Tree depth.
   * @param zeroValue Zero values for zeroes.
   * @param arity The number of children for each node.
   */
  constructor(hash: HashFunction, depth: number, zeroValue: Node, arity: number) {
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
   * Returns the zeroes nodes of the tree.
   * @returns List of zeroes.
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

      const leftNeighbours: Array<Node> = this._nodes[level].slice(index - position, index)
      const rightNeighbours: Array<Node> = Array(this._arity - 1 - position).fill(this.zeroes[level])

      node = this._hash(leftNeighbours.concat([node], rightNeighbours))
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
    const path: Array<number> = []

    this.forEachLevel(index, (level, index, position) => {
      path.push(position)

      const leftNeighbours: Array<Node> = this._nodes[level].slice(index - position, index)
      const lastRighIndex = index + this._arity - position
      const numOfLeaves = this._nodes[level].length
      let rightNeighbours: Array<Node> = this._nodes[level].slice(index + 1, Math.min(numOfLeaves, lastRighIndex))

      if (numOfLeaves < lastRighIndex) {
        rightNeighbours = rightNeighbours.concat(Array(lastRighIndex - numOfLeaves).fill(this.zeroes[level]))
      }

      siblingNodes[level] = leftNeighbours.concat(rightNeighbours)
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
      proof.siblingNodes[i].splice(proof.path[i], 0, node)
      node = this._hash(proof.siblingNodes[i])
    }

    return proof.root === node
  }

  private forEachLevel(index: number, callback: (level: number, index: number, position: number) => void) {
    for (let level = 0; level < this._depth; level += 1) {
      callback(level, index, index % this._arity)

      index = Math.floor(index / this.arity)
    }
  }
}
