export type StrBigInt = string | bigint

export type Proof = {
  pi_a: StrBigInt[]
  pi_b: StrBigInt[][]
  pi_c: StrBigInt[]
  protocol: string
  curve: string
}

export type RLNFullProof = {
  proof: Proof
  publicSignals: RLNPublicSignals
}

export type SemaphoreFullProof = {
  proof: Proof
  publicSignals: SemaphorePublicSignals
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

export type SemaphoreSolidityProof = [
  StrBigInt,
  StrBigInt,
  StrBigInt,
  StrBigInt,
  StrBigInt,
  StrBigInt,
  StrBigInt,
  StrBigInt
]

export type SemaphoreWitness = {
  identityNullifier: StrBigInt
  identityTrapdoor: StrBigInt
  treeSiblings: StrBigInt[]
  treePathIndices: number[]
  externalNullifier: StrBigInt
  signalHash: StrBigInt
}
