export interface Identity {
  identityNullifier: bigint
  identityTrapdoor: bigint
}

export interface IProof {
  proof: any
  publicSignals: Array<bigint | string>
}

export interface MerkleProof {
  root: bigint
  indices: Array<any>
  pathElements: Array<any>
}

export type IdentityFactoryMetadata = {} | { signedMessage: string } |
{ identityNullifier: bigint, identityTrapdoor: bigint }
