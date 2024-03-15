import { mulPointEscalar } from "@zk-kit/baby-jubjub"
import { deriveSecretScalar } from "@zk-kit/eddsa-poseidon"
import { EncryptionKey } from "../src/types"

/* eslint import/prefer-default-export: 0 */

/**
 * Generates an Elliptic-Curve Diffie–Hellman (ECDH) shared key given a private
 * key and a public key.
 * @param privKey A private key generated using genPrivKey()
 * @param pubKey A public key generated using genPubKey()
 * @returns The ECDH shared key.
 */
export const genEcdhSharedKey = (privKey: bigint, pubKey: [bigint, bigint]): EncryptionKey<bigint> => {
    const secretScalar = deriveSecretScalar(privKey)

    return mulPointEscalar(pubKey, secretScalar) as EncryptionKey<bigint>
}
