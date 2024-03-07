import { mulPointEscalar } from "@zk-kit/baby-jubjub"
import { derivePublicKey, deriveSecretScalar } from "@zk-kit/eddsa-poseidon"
import { EncryptionKey } from "../src/types"

/**
 * Generate a public key from a private key
 * @param privateKey the private key to generate a public key from
 * @returns the public key
 */
export const genPublicKey = (privateKey: bigint): [bigint, bigint] => {
    const key = derivePublicKey(privateKey)

    return key.map((x: string) => BigInt(x)) as [bigint, bigint]
}

/**
 * Generates an Elliptic-Curve Diffie–Hellman (ECDH) shared key given a private
 * key and a public key.
 * @param privKey A private key generated using genPrivKey()
 * @param pubKey A public key generated using genPubKey()
 * @returns The ECDH shared key.
 */
export const genEcdhSharedKey = (privKey: bigint, pubKey: [bigint, bigint]): EncryptionKey<bigint> => {
    const secretScalar = deriveSecretScalar(privKey)

    return mulPointEscalar(pubKey, BigInt(secretScalar)) as EncryptionKey<bigint>
}
