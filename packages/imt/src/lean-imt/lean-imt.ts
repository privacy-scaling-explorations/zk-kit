import { LeanIMTHashFunction, LeanIMTMerkleProof } from "./types"
import { requireArray, requireDefinedParameter, requireFunction, requireNumber } from "./utils"

/**
 * The {@link LeanIMT} is an optimized binary version of the {@link IMT}.
 * This implementation exclusively supports binary trees, eliminates the use of
 * zeroes, and the tree's {@link LeanIMT#depth} is dynamic. When a node doesn't have the right child,
 * instead of using a zero hash as in the IMT, the node's value becomes that
 * of its left child. Furthermore, rather than utilizing a static tree depth,
 * it is updated based on the number of {@link LeanIMT#leaves} in the tree. This approach
 * results in the calculation of significantly fewer hashes, making the tree more efficient.
 */
export default class LeanIMT<N = bigint> {
    /**
     * The matrix where all the tree nodes are stored. The first index indicates
     * the level of the tree, while the second index represents the node's
     * position within that specific level. The last level will always contain
     * a list with a single element, which is the root.
     * Most of the attributes of this class are getters which can retrieve
     * their values from this matrix.
     */
    private readonly _nodes: N[][]
    /**
     * The hash function used to compute the tree nodes.
     */
    private readonly _hash: LeanIMTHashFunction<N>

    /**
     * It initializes the tree with a given hash function and an optional list of leaves.
     * @param hash The hash function used to create nodes.
     * @param leaves The list of leaves.
     */
    constructor(hash: LeanIMTHashFunction<N>, leaves: N[] = []) {
        requireDefinedParameter(hash, "hash")
        requireFunction(hash, "hash")
        requireArray(leaves, "leaves")

        // Initialize the attributes.
        this._nodes = [[]]
        this._hash = hash

        // Initialize the tree with a list of leaves if there are any.
        if (leaves.length > 0) {
            this.insertMany(leaves)
        }
    }

    /**
     * The root of the tree. This value doesn't need to be stored as
     * it is always the first and unique element of the last level of the tree.
     * Its value can be retrieved in {@link LeanIMT#_nodes}.
     * @returns The root hash of the tree.
     */
    public get root(): N {
        return this._nodes[this.depth][0]
    }

    /**
     * The depth of the tree, which equals the number of levels - 1.
     * @returns The depth of the tree.
     */
    public get depth(): number {
        return this._nodes.length - 1
    }

    /**
     * The leaves of the tree. They can be retrieved from the first
     * level of the tree using {@link LeanIMT#_nodes}. The returned
     * value is a copy of the array and not the original object.
     * @returns The list of tree leaves.
     */
    public get leaves(): N[] {
        return this._nodes[0].slice()
    }

    /**
     * The size of the tree, which the number of its leaves.
     * It's the length of the first level's list.
     * @returns The number of leaves of the tree.
     */
    public get size(): number {
        return this._nodes[0].length
    }

    /**
     * It returns the index of a leaf. If the leaf does not exist it returns -1.
     * @param leaf A leaf of the tree.
     * @returns The index of the leaf.
     */
    public indexOf(leaf: N): number {
        requireDefinedParameter(leaf, "leaf")

        return this._nodes[0].indexOf(leaf)
    }

    /**
     * It returns true if the leaf exists, and false otherwise
     * @param leaf A leaf of the tree.
     * @returns True if the tree has the leaf, and false otherwise.
     */
    public has(leaf: N): boolean {
        requireDefinedParameter(leaf, "leaf")

        return this._nodes[0].includes(leaf)
    }

    /**
     * The leaves are inserted incrementally. If 'i' is the index of the last
     * leaf, the new one will be inserted at position 'i + 1'. Every time a
     * new leaf is inserted, the nodes that separate the new leaf from the root
     * of the tree are created or updated if they already exist, from bottom to top.
     * When a node has only one child (the left one), its value takes on the value
     * of the child. Otherwise, the hash of the children is calculated.
     * @param leaf The new leaf to be inserted in the tree.
     */
    public insert(leaf: N) {
        requireDefinedParameter(leaf, "leaf")

        // If the next depth is greater, a new tree level will be added.
        if (this.depth < Math.ceil(Math.log2(this.size + 1))) {
            // Adding an array is like adding a new level.
            this._nodes.push([])
        }

        let node = leaf
        // The index of the new leaf equals the number of leaves in the tree.
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

    /**
     * This function is useful when you want to insert N leaves all at once.
     * It is more efficient than using the {@link LeanIMT#insert} method N times because it
     * significantly reduces the number of cases where a node has only one
     * child, which is a common occurrence in gradual insertion.
     * @param leaves The list of leaves to be inserted.
     */
    public insertMany(leaves: N[]) {
        requireDefinedParameter(leaves, "leaves")
        requireArray(leaves, "leaves")

        if (leaves.length === 0) {
            throw new Error("There are no leaves to add")
        }

        let startIndex = this.size >> 1

        this._nodes[0].push(...leaves)

        // Calculate how many tree levels will need to be added
        // using the number of leaves.
        const numberOfNewLevels = Math.ceil(Math.log2(this.size)) - this.depth

        // Add the new levels.
        for (let i = 0; i < numberOfNewLevels; i += 1) {
            this._nodes.push([])
        }

        for (let level = 0; level < this.depth; level += 1) {
            // Calculate the number of nodes of the next level.
            const numberOfNodes = Math.ceil(this._nodes[level].length / 2)

            for (let index = startIndex; index < numberOfNodes; index += 1) {
                const rightNode = this._nodes[level][index * 2 + 1]
                const leftNode = this._nodes[level][index * 2]

                const parentNode = rightNode ? this._hash(leftNode, rightNode) : leftNode

                this._nodes[level + 1][index] = parentNode
            }

            startIndex >>= 1
        }
    }

    /**
     * It updates a leaf in the tree. It's very similar to the {@link LeanIMT#insert} function.
     * @param index The index of the leaf to be updated.
     * @param newLeaf The new leaf to be inserted.
     */
    public update(index: number, newLeaf: N) {
        requireDefinedParameter(index, "index")
        requireDefinedParameter(newLeaf, "newLeaf")
        requireNumber(index, "index")

        let node = newLeaf

        for (let level = 0; level < this.depth; level += 1) {
            this._nodes[level][index] = node

            if (index & 1) {
                const sibling = this._nodes[level][index - 1]

                node = this._hash(sibling, node)
            } else {
                // In this case there could still be a right node
                // because the path might not be the rightmost one
                // (like the 'insert' function).
                const sibling = this._nodes[level][index + 1]

                if (sibling) {
                    node = this._hash(node, sibling)
                }
            }

            index >>= 1
        }

        this._nodes[this.depth] = [node]
    }

    /**
     * It generates a {@link LeanIMTMerkleProof} for a leaf of the tree.
     * That proof can be verified by this tree using the same hash function.
     * @param index The index of the leaf for which a Merkle proof will be generated.
     * @returns The Merkle proof of the leaf.
     */
    public generateProof(index: number): LeanIMTMerkleProof<N> {
        requireDefinedParameter(index, "index")
        requireNumber(index, "index")

        if (index < 0 || index >= this.size) {
            throw new Error(`The leaf at index '${index}' does not exist in this tree`)
        }

        const leaf = this.leaves[index]
        const siblings: N[] = []
        const path: number[] = []

        for (let level = 0; level < this.depth; level += 1) {
            const isRightNode = index & 1
            const siblingIndex = isRightNode ? index - 1 : index + 1
            const sibling = this._nodes[level][siblingIndex]

            // If the sibling node does not exist, it means that the node at
            // this level has the same value as its child. Therefore, there
            // is no need to include it in the proof since there is no hash to calculate.
            if (sibling !== undefined) {
                path.push(isRightNode)
                siblings.push(sibling)
            }

            index >>= 1
        }

        // The index might be different from the original index of the leaf, since
        // in some cases some siblings are not included (as explained above).
        return { root: this.root, leaf, index: Number.parseInt(path.reverse().join(""), 2), siblings }
    }

    /**
     * It verifies a {@link LeanIMTMerkleProof} to confirm that a leaf indeed
     * belongs to the tree.
     * @param proof The Merkle tree proof.
     * @returns True if the leaf is part of the tree, and false otherwise.
     */
    public verifyProof(proof: LeanIMTMerkleProof<N>): boolean {
        requireDefinedParameter(proof, "proof")

        const { root, leaf, siblings, index } = proof

        requireDefinedParameter(proof.root, "proof.root")
        requireDefinedParameter(proof.leaf, "proof.leaf")
        requireDefinedParameter(proof.siblings, "proof.siblings")
        requireDefinedParameter(proof.index, "proof.index")

        requireArray(proof.siblings, "proof.siblings")
        requireNumber(proof.index, "proof.index")

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
