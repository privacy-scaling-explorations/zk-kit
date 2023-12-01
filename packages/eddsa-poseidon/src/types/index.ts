export type Signature = {
    R8: Point
    S: bigint
}

export type PrivateKey = number | bigint | string | Buffer

export type Point = [bigint, bigint]
