export type Value = any

export type HashFunction = (values: Value[]) => Value

export type HashTowerHashChainProof = {
    levelLengths: Value
    digestOfDigests: Value
    digests: Value[]
    rootLv: number
    rootLevel: Value[]
    childrens: Value[][]
    item: Value
}
