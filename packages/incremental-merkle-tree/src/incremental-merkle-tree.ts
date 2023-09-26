import requireDefinedParameter from "./requireDefinedParameter"
import { HashFunction, MerkleProof } from "./types"

// TODO: support arity
// TODO: add comments

/**
 * A Merkle tree is a tree in which every leaf node is labelled with the cryptographic hash of a
 * data block, and every non-leaf node is labelled with the cryptographic hash of the labels of its child nodes.
 * It allows efficient and secure verification of the contents of large data structures.
 * This class is a TypeScript implementation of Incremental Merkle tree and it
 * provides all the functions to create efficient trees and generate/verify proofs of membership.
 */
export default class IncrementalMerkleTree<N = bigint> {
    private readonly _nodes: N[][]
    private readonly _hash: HashFunction<N>
    private readonly _arity: number

    /**
     * Initializes the tree with a given hash function and an
     * optional list of leaves.
     * @param hash Hash function used to create nodes.
     * @param arity Number of children for each node.
     * @param leaves List of leaves.
     */
    constructor(hash: HashFunction<N>, arity: number, leaves: N[] = []) {
        requireDefinedParameter(hash, "hash")
        requireDefinedParameter(hash, "arity")
        requireDefinedParameter(hash, "leaves")

        // Initialize the attributes.
        this._nodes = [[]]
        this._hash = hash
        this._arity = arity

        // Initialize the tree with a list of leaves if there are any.
        if (leaves.length > 0) {
            this.insertMany(leaves)
        }

        // Freeze the objects. It prevents unintentional changes.
        Object.freeze(this._nodes)
        Object.freeze(this._hash)
    }

    /**
     * Returns the root hash of the tree.
     * @returns Root hash.
     */
    public get root(): N {
        return this._nodes[this.depth][0]
    }

    /**
     * Returns the depth of the tree.
     * @returns Tree depth.
     */
    public get depth(): number {
        return this._nodes.length - 1
    }

    /**
     * Returns the leaves of the tree.
     * @returns List of leaves.
     */
    public get leaves(): N[] {
        return this._nodes[0].slice()
    }

    /**
     * Returns the number of children for each node.
     * @returns Number of children per node.
     */
    public get arity(): number {
        return this._arity
    }

    /**
     * Returns the number of leaves in the tree.
     * @returns Number of leaves.
     */
    public get size(): number {
        return this._nodes[0].length
    }

    /**
     * Returns the index of a leaf. If the leaf does not exist it returns -1.
     * @param leaf Tree leaf.
     * @returns Index of the leaf.
     */
    public indexOf(leaf: N): number {
        requireDefinedParameter(leaf, "leaf")

        return this._nodes[0].indexOf(leaf)
    }

    /**
     * Returns true if the leaf exists and false otherwise
     * @param leaf Tree leaf.
     * @returns True if the tree has the leaf, false otherwise.
     */
    public has(leaf: N): boolean {
        requireDefinedParameter(leaf, "leaf")

        return this._nodes[0].includes(leaf)
    }

    /**
     * Inserts a new leaf in the tree.
     * @param leaf New leaf.
     */
    public insert(leaf: N) {
        requireDefinedParameter(leaf, "leaf")

        // If the next depth is greater, a new tree level will be added.
        if (this.depth < Math.ceil(Math.log2(this.size + 1))) {
            // Adding an array is like adding a new level.
            this._nodes.push([])
        }

        let node = leaf
        let index = this.size

        for (let level = 0; level < this.depth; level += 1) {
            this._nodes[level][index] = node

            // Bitwise AND, 0 -> left or 1 -> right.
            // If the node is a right node the parent node will be the hash
            // of the child nodes. Otherwise, parent will equal left child node.
            if (index & 1) {
                const sibling = this._nodes[level][index - 1]
                node = this._hash(sibling, node)
            }

            // Right shift, it divides a number by 2 and discards the remainder.
            index >>= 1
        }

        // Store the new root.
        this._nodes[this.depth] = [node]
    }

    public insertMany(leaves: N[]) {
        requireDefinedParameter(leaves, "leaves")

        if (leaves.length === 0) {
            throw new Error("There are no leaves to add")
        }

        const oldSize = this.size

        this._nodes[0].push(...leaves)

        // Calculate how many tree levels will need to be added
        // using the number of leaves.
        const numberOfNewLevels = Math.ceil(Math.log2(this.size)) - this.depth

        // Add the new levels.
        for (let i = 0; i < numberOfNewLevels; i += 1) {
            this._nodes.push([])
        }

        for (let level = 0; level < this.depth; level += 1) {
            // Calculate the number of nodes of a level.
            const numberOfNodes = Math.ceil(this._nodes[level].length / 2)

            for (let index = oldSize >> (level + 1); index < numberOfNodes; index += 1) {
                const rightNode = this._nodes[level][index * 2 + 1]
                const leftNode = this._nodes[level][index * 2]

                const parentNode = rightNode ? this._hash(leftNode, rightNode) : leftNode

                this._nodes[level + 1][index] = parentNode
            }
        }
    }

    /**
     * Updates a leaf in the tree.
     * @param index Index of the leaf to be updated.
     * @param newLeaf New leaf value.
     */
    public update(index: number, newLeaf: N) {
        requireDefinedParameter(index, "index")
        requireDefinedParameter(newLeaf, "newLeaf")

        let node = newLeaf

        for (let level = 0; level < this.depth; level += 1) {
            this._nodes[level][index] = node

            if (index & 1) {
                const sibling = this._nodes[level][index - 1]
                node = this._hash(sibling, node)
            } else {
                const sibling = this._nodes[level][index + 1]

                if (sibling) {
                    node = this._hash(node, sibling)
                }
            }

            index >>= 1
        }

        this._nodes[this.depth] = [node]
    }

    public generateProof(index: number): MerkleProof<N> {
        requireDefinedParameter(index, "index")

        if (index === -1) {
            throw new Error(`The leaf at index ${index} does not exist in this tree`)
        }

        const leaf = this.leaves[index]
        const siblings: N[] = []
        const path: number[] = []

        for (let level = 0; level < this.depth; level += 1) {
            const isRightNode = index & 1
            const siblingIndex = isRightNode ? index - 1 : index + 1
            const sibling = this._nodes[level][siblingIndex]

            if (sibling !== undefined) {
                path.push(isRightNode)
                siblings.push(sibling)
            }

            index >>= 1
        }

        return { root: this.root, leaf, index: Number.parseInt(path.reverse().join(""), 2), siblings }
    }

    public verifyProof(proof: MerkleProof<N>): boolean {
        requireDefinedParameter(proof, "proof")

        const { root, leaf, siblings, index } = proof

        requireDefinedParameter(proof.root, "proof.root")
        requireDefinedParameter(proof.leaf, "proof.leaf")
        requireDefinedParameter(proof.siblings, "proof.siblings")
        requireDefinedParameter(proof.index, "proof.index")

        let node = leaf

        for (let i = 0; i < siblings.length; i += 1) {
            if ((index >> i) & 1) {
                node = this._hash(siblings[i], node)
            } else {
                node = this._hash(node, siblings[i])
            }
        }

        return root === node
    }
}
