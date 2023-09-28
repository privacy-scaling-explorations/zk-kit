import checkParameter from "./checkParameter"
import { IMTHashFunction, IMTMerkleProof, IMTNode } from "./types"

/**
 * An {@link IMT} (aka Incremental Merkle Tree) is a type of data structure used in cryptography and
 * computer science for efficiently verifying the integrity of a large set of data,
 * especially in situations where new data is added over time. It is based on the concept
 * of a Merkle tree, bit its key feature is its ability to efficiently update the tree
 * when new data is added or existing data is modified.
 * In this implementation, the tree is constructed using a fixed maximum {@link IMT#depth}
 * value, and a list of {@link IMT#zeroes} (one for each level) is used to compute the
 * hash of a node when not all of its children are defined. The number of children for each
 * node can also be specified with {@link IMT#arity}.
 */
export default class IMT {
    private readonly _nodes: IMTNode[][]
    private readonly _zeroes: IMTNode[]
    private readonly _hash: IMTHashFunction
    private readonly _depth: number
    private readonly _arity: number

    /**
     * Initializes the tree with an hash function, the depth, the zero value to use for zeroes
     * and the arity (i.e. the number of children for each node).
     * @param hash Hash function.
     * @param depth Tree depth.
     * @param zeroValue Zero values for zeroes.
     * @param arity The number of children for each node.
     * @param leaves The list of initial leaves.
     */
    constructor(hash: IMTHashFunction, depth: number, zeroValue: IMTNode, arity = 2, leaves: IMTNode[] = []) {
        checkParameter(hash, "hash", "function")
        checkParameter(depth, "depth", "number")
        checkParameter(zeroValue, "zeroValue", "number", "string", "bigint")
        checkParameter(arity, "arity", "number")
        checkParameter(leaves, "leaves", "object")

        if (leaves.length > arity ** depth) {
            throw new Error(`The tree cannot contain more than ${arity ** depth} leaves`)
        }

        // Initialize the attributes.
        this._hash = hash
        this._depth = depth
        this._zeroes = []
        this._nodes = []
        this._arity = arity

        for (let level = 0; level < depth; level += 1) {
            this._zeroes.push(zeroValue)
            this._nodes[level] = []
            // There must be a zero value for each tree level (except the root).
            zeroValue = hash(Array(this._arity).fill(zeroValue))
        }

        this._nodes[depth] = []

        // It initializes the tree with a list of leaves if there are any.
        if (leaves.length > 0) {
            this._nodes[0] = leaves

            for (let level = 0; level < depth; level += 1) {
                for (let index = 0; index < Math.ceil(this._nodes[level].length / arity); index += 1) {
                    const position = index * arity
                    const children = []

                    for (let i = 0; i < arity; i += 1) {
                        children.push(this._nodes[level][position + i] ?? this.zeroes[level])
                    }

                    this._nodes[level + 1][index] = hash(children)
                }
            }
        } else {
            // If there are no leaves, the default root is the last zero value.
            this._nodes[depth][0] = zeroValue
        }

        // Freeze the array objects. It prevents unintentional changes.
        Object.freeze(this._zeroes)
        Object.freeze(this._nodes)
    }

    /**
     * Returns the root hash of the tree.
     * @returns Root hash.
     */
    public get root(): IMTNode {
        return this._nodes[this.depth][0]
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
    public get leaves(): IMTNode[] {
        return this._nodes[0].slice()
    }

    /**
     * Returns the zeroes nodes of the tree.
     * @returns List of zeroes.
     */
    public get zeroes(): IMTNode[] {
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
    public indexOf(leaf: IMTNode): number {
        checkParameter(leaf, "leaf", "number", "string", "bigint")

        return this._nodes[0].indexOf(leaf)
    }

    /**
     * Inserts a new leaf in the tree.
     * @param leaf New leaf.
     */
    public insert(leaf: IMTNode) {
        checkParameter(leaf, "leaf", "number", "string", "bigint")

        if (this._nodes[0].length >= this.arity ** this.depth) {
            throw new Error("The tree is full")
        }

        let node = leaf
        let index = this._nodes[0].length

        for (let level = 0; level < this.depth; level += 1) {
            const position = index % this.arity
            const levelStartIndex = index - position
            const levelEndIndex = levelStartIndex + this.arity

            const children = []
            this._nodes[level][index] = node

            for (let i = levelStartIndex; i < levelEndIndex; i += 1) {
                if (i < this._nodes[level].length) {
                    children.push(this._nodes[level][i])
                } else {
                    children.push(this._zeroes[level])
                }
            }

            node = this._hash(children)
            index = Math.floor(index / this.arity)
        }

        this._nodes[this.depth][0] = node
    }

    /**
     * Deletes a leaf from the tree. It does not remove the leaf from
     * the data structure. It set the leaf to be deleted to a zero value.
     * @param index Index of the leaf to be deleted.
     */
    public delete(index: number) {
        this.update(index, this.zeroes[0])
    }

    /**
     * Updates a leaf in the tree.
     * @param index Index of the leaf to be updated.
     * @param newLeaf New leaf value.
     */
    public update(index: number, newLeaf: IMTNode) {
        checkParameter(index, "index", "number")

        if (index < 0 || index >= this._nodes[0].length) {
            throw new Error("The leaf does not exist in this tree")
        }

        let node = newLeaf

        for (let level = 0; level < this.depth; level += 1) {
            const position = index % this.arity
            const levelStartIndex = index - position
            const levelEndIndex = levelStartIndex + this.arity

            const children = []
            this._nodes[level][index] = node

            for (let i = levelStartIndex; i < levelEndIndex; i += 1) {
                if (i < this._nodes[level].length) {
                    children.push(this._nodes[level][i])
                } else {
                    children.push(this.zeroes[level])
                }
            }

            node = this._hash(children)
            index = Math.floor(index / this.arity)
        }

        this._nodes[this.depth][0] = node
    }

    /**
     * Creates a proof of membership.
     * @param index Index of the proof's leaf.
     * @returns Proof object.
     */
    public createProof(index: number): IMTMerkleProof {
        checkParameter(index, "index", "number")

        if (index < 0 || index >= this._nodes[0].length) {
            throw new Error("The leaf does not exist in this tree")
        }

        const siblings: IMTNode[][] = []
        const pathIndices: number[] = []
        const leafIndex = index

        for (let level = 0; level < this.depth; level += 1) {
            const position = index % this.arity
            const levelStartIndex = index - position
            const levelEndIndex = levelStartIndex + this.arity

            pathIndices[level] = position
            siblings[level] = []

            for (let i = levelStartIndex; i < levelEndIndex; i += 1) {
                if (i !== index) {
                    if (i < this._nodes[level].length) {
                        siblings[level].push(this._nodes[level][i])
                    } else {
                        siblings[level].push(this.zeroes[level])
                    }
                }
            }

            index = Math.floor(index / this.arity)
        }

        return { root: this.root, leaf: this._nodes[0][leafIndex], pathIndices, siblings, leafIndex }
    }

    /**
     * Verifies a proof and return true or false.
     * @param proof Proof to be verified.
     * @returns True or false.
     */
    public verifyProof(proof: IMTMerkleProof): boolean {
        checkParameter(proof, "proof", "object")
        checkParameter(proof.root, "proof.root", "number", "string", "bigint")
        checkParameter(proof.leaf, "proof.leaf", "number", "string", "bigint")
        checkParameter(proof.siblings, "proof.siblings", "object")
        checkParameter(proof.pathIndices, "proof.pathElements", "object")

        let node = proof.leaf

        for (let i = 0; i < proof.siblings.length; i += 1) {
            const children = proof.siblings[i].slice()

            children.splice(proof.pathIndices[i], 0, node)

            node = this._hash(children)
        }

        return proof.root === node
    }
}
