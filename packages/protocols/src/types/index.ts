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
  publicSignals: StrBigInt[]
}

export type SolidityProof = StrBigInt[]

export type SemaphoreWitness = {
  identity_nullifier: StrBigInt
  identity_trapdoor: StrBigInt
  path_elements: StrBigInt[]
  identity_path_index: number[]
  external_nullifier: StrBigInt
  signal_hash: StrBigInt
}
