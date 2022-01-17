import checkParameter from "./checkParameter"
import { HashFunction, Proof, Node } from "./types"
import IncrementalTree from "./incremental-tree"

export default class NAryIncrementalTree extends IncrementalTree {
  constructor(hash: HashFunction, depth: number, zeroValue: Node, arity: number) {
    super(hash, depth, zeroValue, arity);
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
      path.push(position);

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
