export type HashFunction = (BigInts: BigInt[]) => BigInt

export type HashTowerHashChainProof = {
    levelLengths: BigInt
    digestOfDigests: BigInt
    digests: BigInt[]
    rootLv: number
    rootLevel: BigInt[]
    childrens: BigInt[][]
    item: BigInt
}
