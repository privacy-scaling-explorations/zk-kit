import { EdDSAPoseidonFactory, SupportedHashingAlgorithms } from "./eddsa-poseidon-factory"

export const {
    EdDSAPoseidon,
    derivePublicKey,
    deriveSecretScalar,
    packPublicKey,
    packSignature,
    signMessage,
    unpackPublicKey,
    unpackSignature,
    verifySignature
} = EdDSAPoseidonFactory(SupportedHashingAlgorithms.BLAKE2b)

export * from "./types"
