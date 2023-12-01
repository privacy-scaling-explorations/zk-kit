export type BigNumber = bigint | string

export type BigNumberish = BigNumber | number | Buffer

export type Point<N = BigNumber> = [N, N]

export type Signature<N = BigNumber> = {
    R8: Point<N>
    S: N
}
