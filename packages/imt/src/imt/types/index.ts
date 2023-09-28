export type IMTNode = any

export type IMTHashFunction = (values: IMTNode[]) => IMTNode

export type IMTMerkleProof = {
    root: any
    leaf: any
    leafIndex: number
    siblings: any[]
    pathIndices: number[]
}
