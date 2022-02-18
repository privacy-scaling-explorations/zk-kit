export type StrBigInt = string | bigint

export type Proof = {
  pi_a: StrBigInt[]
  pi_b: StrBigInt[][]
  pi_c: StrBigInt[]
  protocol: string
  curve: string
}

export type FullProof = {
  proof: Proof
  publicSignals: RLNPublicSignals | SemaphorePublicSignals
}

export type RLNPublicSignals = {
  yShare: StrBigInt
  merkleRoot: StrBigInt
  internalNullifier: StrBigInt
  signalHash: StrBigInt
  epoch: StrBigInt
  rlnIdentifier: StrBigInt
}

export type SemaphorePublicSignals = {
  merkleRoot: StrBigInt
  nullifierHash: StrBigInt
  signalHash: StrBigInt
  externalNullifier: StrBigInt
}

export type SolidityProof = StrBigInt[]

export type SemaphoreWitness = {
  identityNullifier: StrBigInt
  identityTrapdoor: StrBigInt
  treeSiblings: StrBigInt[]
  treePathIndices: number[]
  externalNullifier: StrBigInt
  signalHash: StrBigInt
}
