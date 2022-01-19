export interface Identity {
  identityNullifier: bigint
  identityTrapdoor: bigint
}

export declare type Proof = {
  pi_a: string[]
  pi_b: [[string[]], [string[]], [string[]]]
  pi_c: string[]
  protocol: string
  curve: string
}

export interface FullProof {
  proof: Proof
  publicSignals: (bigint | string)[]
}

export interface MerkleProof {
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
