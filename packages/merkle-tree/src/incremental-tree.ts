import checkParameter from "./checkParameter"
import { HashFunction, Node } from "./types"

export default class IncrementalTree {
  static readonly maxDepth = 32 // 5**32

  protected _root: Node
  protected readonly _nodes: Node[][]
  protected readonly _zeroes: Node[]
  protected readonly _hash: HashFunction
  protected readonly _depth: number
  protected readonly _arity: number

  constructor(hash: HashFunction, depth: number, zeroValue: Node, arity: number) {
    checkParameter(hash, "hash", "function")
    checkParameter(depth, "depth", "number")
    checkParameter(zeroValue, "zeroValue", "number", "string", "bigint")

    if (depth < 1 || depth > IncrementalTree.maxDepth) {
      throw new Error("The tree depth must be between 1 and 32")
    }

    // Initialize the attributes.
    this._hash = hash
    this._depth = depth
    this._zeroes = []
    this._nodes = []
    this._arity = arity;

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
}

