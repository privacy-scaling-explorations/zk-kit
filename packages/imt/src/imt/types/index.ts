/**
 * It represents a node of the tree, which can be any value.
 */
export type IMTNode = any

/**
 * The hash function is used to compute the nodes of the tree.
 * In a binary Merkle tree, each node is the hash of its two children.
 */
export type IMTHashFunction = (values: IMTNode[]) => IMTNode

/**
 * The Merkle Proof contains the necessary parameters to enable the
 * verifier to be certain that a leaf belongs to the tree. Given the value
 * of the leaf and its index, it is possible to traverse the tree by
 * recalculating the hashes up to the root and using the node siblings.
 * If the calculated root matches the root in the proof, then the leaf
 * belongs to the tree. It's important to note that the function used
 * to generate the proof and the one used to verify it must use the
 * same hash function.
 */
export type IMTMerkleProof = {
    root: any
    leaf: any
    leafIndex: number
    siblings: any[]
    pathIndices: number[]
}
