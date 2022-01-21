export type StrBigInt = string | bigint

export declare type Proof = {
  pi_a: StrBigInt[]
  pi_b: StrBigInt[][]
  pi_c: StrBigInt[]
  protocol: string
  curve: string
}

export declare type FullProof = {
  proof: Proof
  publicSignals: StrBigInt[]
}

export declare type SolidityProof = {
  a: [StrBigInt, StrBigInt]
  b: [[StrBigInt, StrBigInt], [StrBigInt, StrBigInt]]
  c: [StrBigInt, StrBigInt]
  inputs: StrBigInt[]
}

export declare type SemaphoreWitness = {
  identity_nullifier: StrBigInt
  identity_trapdoor: StrBigInt
  path_elements: StrBigInt[]
  identity_path_index: number[]
  external_nullifier: StrBigInt
  signal_hash: StrBigInt
}

export declare type MerkleProof = {
  root: any
  leaf: any
  siblings: any[]
  pathIndices: number[]
}

export declare type SerializedIdentity = {
  identityNullifier: string
  identityTrapdoor: string
  secret: string[]
  multipartSecret: string[]
}
