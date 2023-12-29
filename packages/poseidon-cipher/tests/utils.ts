import { mulPointEscalar, r } from "@zk-kit/baby-jubjub"
import { derivePublicKey, deriveSecretScalar } from "@zk-kit/eddsa-poseidon"
import { randomBytes } from "crypto"
import { EncryptionKey } from "../src/types"

/**
 * Returns a BabyJub-compatible random value. We create it by first generating
 * a random value (initially 256 bits large) modulo the snark field size as
 * described in EIP197. This results in a key size of roughly 253 bits and no
 * more than 254 bits. To prevent modulo bias, we then use this efficient
 * algorithm:
 * http://cvsweb.openbsd.org/cgi-bin/cvsweb/~checkout~/src/lib/libc/crypt/arc4random_uniform.c
 * @returns A BabyJub-compatible random value.
 */
export const genRandomBabyJubValue = (): bigint => {
    // Prevent modulo bias
    // const lim = BigInt('0x10000000000000000000000000000000000000000000000000000000000000000')
    // const min = (lim - SNARK_FIELD_SIZE) % SNARK_FIELD_SIZE
    const min = BigInt("6350874878119819312338956282401532410528162663560392320966563075034087161851")

    let privKey: bigint = r

    do {
        const rand = BigInt(`0x${randomBytes(32).toString("hex")}`)

        if (rand >= min) {
            privKey = rand % r
        }
    } while (privKey >= r)

    return privKey
}

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
