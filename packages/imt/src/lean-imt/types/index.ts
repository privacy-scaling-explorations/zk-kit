export type LeanIMTHashFunction<N = bigint> = (a: N, b: N) => N

export type LeanIMTMerkleProof<N = bigint> = {
    root: N
    leaf: N
    index: number
    siblings: N[]
}
