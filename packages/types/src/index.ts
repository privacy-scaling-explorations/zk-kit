export interface Identity {
  identityNullifier: bigint
  identityTrapdoor: bigint
}

export type Proof = {
  pi_a: Array<string>,
  pi_b: [ [Array<string>], [Array<string>], [Array<string>] ],
  pi_c: Array<string>
  protocol: string,
  curve: string
}

export interface FullProof {
  proof: Proof
  publicSignals: Array<bigint | string>
}

export interface MerkleProof {
  root: bigint
  indices: Array<any>
  pathElements: Array<any>
}

export type SerializedIdentity = { identityNullifier: string, identityTrapdoor: string };
