export type HashFunction<N = bigint> = (a: N, b: N) => N

export type MerkleProof<N = bigint> = {
    root: N
    leaf: N
    index: number
    siblings: N[]
}
