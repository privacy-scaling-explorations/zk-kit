import { derivePublicKey } from "@zk-kit/eddsa-poseidon"
import { Nonce, PlainText, poseidonDecrypt, poseidonEncrypt, poseidonPerm } from "@zk-kit/poseidon-cipher"
import { crypto } from "@zk-kit/utils"
import { WitnessTester } from "circomkit"
import { circomkit, genEcdhSharedKey } from "./common"

describe("poseidon-cipher", () => {
    describe("poseidonDecrypt", () => {
        let circuit: WitnessTester<["ciphertext", "nonce", "key"], ["decrypted"]>

        const privateKey = crypto.getRandomValues(32)
        const publicKey = derivePublicKey(privateKey)
        const encryptionKey = genEcdhSharedKey(privateKey, publicKey)

        const nonce: Nonce = BigInt(5)

        it("Should correctly decrypt the ciphertext", async () => {
            const plainText: PlainText<bigint> = [BigInt(0), BigInt(1), BigInt(3)]

            const cipherText = poseidonEncrypt(plainText, encryptionKey, nonce)
            const decrypted = poseidonDecrypt(cipherText, encryptionKey, nonce, plainText.length)

            const INPUT = {
                ciphertext: cipherText,
                nonce,
                key: encryptionKey
            }

            const OUTPUT = {
                decrypted
            }

            circuit = await circomkit.WitnessTester("poseidon-cipher", {
                file: "poseidon-cipher",
                template: "PoseidonDecrypt",
                params: [plainText.length]
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })

        it("Should correctly decrypt a ciphertext whose plaintext is not a multiple of 3", async () => {
            const plainText: PlainText<bigint> = [BigInt(0), BigInt(1), BigInt(3), BigInt(4)]

            const cipherText = poseidonEncrypt(plainText, encryptionKey, nonce)
            const decrypted = poseidonDecrypt(cipherText, encryptionKey, nonce, plainText.length)

            const INPUT = {
                ciphertext: cipherText,
                nonce,
                key: encryptionKey
            }

            const OUTPUT = {
                decrypted
            }

            circuit = await circomkit.WitnessTester("poseidon-cipher", {
                file: "poseidon-cipher",
                template: "PoseidonDecrypt",
                params: [plainText.length]
            })

            await circuit.expectPass(INPUT, OUTPUT)
        })

        it("Should throw when given an invalid input", async () => {
            const plainText: PlainText<bigint> = [BigInt(0), BigInt(1), BigInt(3), BigInt(0)]

            const cipherText = poseidonEncrypt(plainText, encryptionKey, nonce)
            cipherText[0] = BigInt(10001321)

            const INPUT = {
                ciphertext: cipherText,
                nonce,
                key: encryptionKey
            }

            await circuit.expectFail(INPUT)
        })

        it("Should throw when trying to decrypt using a nonce >= 2^128", async () => {
            const plainText: PlainText<bigint> = [BigInt(0), BigInt(1), BigInt(3), BigInt(0)]

            const cipherText = poseidonEncrypt(plainText, encryptionKey, nonce)

            const INPUT = {
                ciphertext: cipherText,
                nonce: BigInt(2 ** 128 + 1),
                key: encryptionKey
            }

            await circuit.expectFail(INPUT)
        })
    })

    describe("poseidonDecryptWithoutChecks", () => {
        let circuit: WitnessTester<["ciphertext", "nonce", "key"], ["decrypted"]>

        const privateKey = crypto.getRandomValues(32)
        const publicKey = derivePublicKey(privateKey)
        const encryptionKey = genEcdhSharedKey(privateKey, publicKey)

        const plainText: PlainText<bigint> = [BigInt(0), BigInt(1)]
        const nonce: Nonce = BigInt(5)

        const cipherText = poseidonEncrypt(plainText, encryptionKey, nonce)
        const decrypted = poseidonDecrypt(cipherText, encryptionKey, nonce, plainText.length)

        const INPUT = {
            ciphertext: cipherText,
            nonce,
            key: encryptionKey
        }

        const OUTPUT = {
            decrypted
        }

        before(async () => {
            circuit = await circomkit.WitnessTester("poseidon-PoseidonDecryptWithoutCheck", {
                file: "poseidon-cipher",
                template: "PoseidonDecryptWithoutCheck",
                params: [plainText.length]
            })
        })

        it("Should correctly decrypt the ciphertext", async () => {
            await circuit.expectPass(INPUT, OUTPUT)
        })

        it("Should not throw when given an invalid ciphertext", async () => {
            const invalid = INPUT
            invalid.ciphertext[0] = BigInt(10001321)
            const witness = await circuit.calculateWitness(invalid)
            await circuit.expectConstraintPass(witness)
        })

        it("Should not throw when given an invalid nonce (< 2**128)", async () => {
            const invalid = INPUT
            invalid.nonce = BigInt(10001321)
            const witness = await circuit.calculateWitness(invalid)
            await circuit.expectConstraintPass(witness)
        })

        it("Should not throw when given an invalid key", async () => {
            const invalid = INPUT
            invalid.key[0] = BigInt(10001321)
            const witness = await circuit.calculateWitness(invalid)
            await circuit.expectConstraintPass(witness)
        })
    })

    describe("poseidonIterations", () => {
        let circuit: WitnessTester<["ciphertext", "nonce", "key"], ["decrypted"]>

        const privateKey = crypto.getRandomValues(32)
        const publicKey = derivePublicKey(privateKey)
        const encryptionKey = genEcdhSharedKey(privateKey, publicKey)

        const plainText: PlainText<bigint> = [BigInt(0), BigInt(1)]
        const nonce: Nonce = BigInt(5)

        const cipherText = poseidonEncrypt(plainText, encryptionKey, nonce)
        const decrypted = poseidonDecrypt(cipherText, encryptionKey, nonce, plainText.length)

        const INPUT = {
            ciphertext: cipherText,
            nonce,
            key: encryptionKey
        }

        const OUTPUT = {
            decrypted
        }

        before(async () => {
            circuit = await circomkit.WitnessTester("poseidon-PoseidonDecryptIterations", {
                file: "poseidon-cipher",
                template: "PoseidonDecryptIterations",
                params: [plainText.length]
            })
        })

        it("Should correctly decrypt the ciphertext", async () => {
            await circuit.expectPass(INPUT, OUTPUT)
        })

        it("Should throw when given a nonce >= 2^128", async () => {
            const invalid = INPUT
            invalid.nonce = BigInt(2 ** 128 + 1)
            await circuit.expectFail(invalid)
        })
    })

    describe("poseidonPerm", () => {
        let circuit: WitnessTester<["inputs"], ["out"]>

        const inputs = [BigInt(0), BigInt(3)]
        const perms = poseidonPerm(inputs)

        const INPUT = {
            inputs
        }

        const OUTPUT = {
            out: perms
        }

        before(async () => {
            circuit = await circomkit.WitnessTester("poseidon-perm", {
                file: "poseidon-cipher",
                template: "PoseidonPerm",
                params: [inputs.length]
            })
        })

        it("Should compute the hash correctly", async () => {
            await circuit.expectPass(INPUT, OUTPUT)
        })
    })
})
