import { eddsa } from "circomlibjs"
import crypto from "crypto"
import { generatePublicKey, signMessage, verifySignature } from "../src"

describe("EdDSAPoseidon", () => {
    const privateKey = "secret"
    const message = BigInt(2)

    it("Should derive a public key from a private key (string)", async () => {
        const publicKey = generatePublicKey(privateKey)

        const circomlibPublicKey = eddsa.prv2pub(privateKey)

        expect(publicKey[0]).toBe(circomlibPublicKey[0].toString())
        expect(publicKey[1]).toBe(circomlibPublicKey[1].toString())
    })

    it("Should derive a public key from a private key (hexadecimal)", async () => {
        const privateKey = "0x12"

        const publicKey = generatePublicKey(privateKey)

        const circomlibPublicKey = eddsa.prv2pub(Buffer.from(privateKey.slice(2), "hex"))

        expect(publicKey[0]).toBe(circomlibPublicKey[0].toString())
        expect(publicKey[1]).toBe(circomlibPublicKey[1].toString())
    })

    it("Should derive a public key from a private key (buffer)", async () => {
        const privateKey = Buffer.from("secret")

        const publicKey = generatePublicKey(privateKey)

        const circomlibPublicKey = eddsa.prv2pub(privateKey)

        expect(publicKey[0]).toBe(circomlibPublicKey[0].toString())
        expect(publicKey[1]).toBe(circomlibPublicKey[1].toString())
    })

    it("Should derive a public key from a private key (bigint)", async () => {
        const privateKey = BigInt(22)

        const publicKey = generatePublicKey(privateKey)

        const circomlibPublicKey = eddsa.prv2pub(Buffer.from(privateKey.toString(16), "hex"))

        expect(publicKey[0]).toBe(circomlibPublicKey[0].toString())
        expect(publicKey[1]).toBe(circomlibPublicKey[1].toString())
    })

    it("Should derive a public key from a private key (number)", async () => {
        const privateKey = 22

        const publicKey = generatePublicKey(privateKey)

        const circomlibPublicKey = eddsa.prv2pub(Buffer.from(privateKey.toString(16), "hex"))

        expect(publicKey[0]).toBe(circomlibPublicKey[0].toString())
        expect(publicKey[1]).toBe(circomlibPublicKey[1].toString())
    })

    it("Should throw an error if the secret type is not supported", async () => {
        const privateKey = true

        const fun = () => generatePublicKey(privateKey as any)

        expect(fun).toThrow("Invalid private key type.")
    })

    it("Should sign a message (bigint)", async () => {
        const signature = signMessage(privateKey, message)

        const circomlibSignature = eddsa.signPoseidon(privateKey, message)

        expect(signature.R8[0]).toBe(circomlibSignature.R8[0].toString())
        expect(signature.R8[1]).toBe(circomlibSignature.R8[1].toString())
        expect(signature.S).toBe(circomlibSignature.S.toString())
    })

    it("Should sign a message (number)", async () => {
        const message = 22

        const signature = signMessage(privateKey, message)

        const circomlibSignature = eddsa.signPoseidon(privateKey, BigInt(message))

        expect(signature.R8[0]).toBe(circomlibSignature.R8[0].toString())
        expect(signature.R8[1]).toBe(circomlibSignature.R8[1].toString())
        expect(signature.S).toBe(circomlibSignature.S.toString())
    })

    it("Should sign a message (hexadecimal)", async () => {
        const message = "0x12"

        const signature = signMessage(privateKey, message)

        const circomlibSignature = eddsa.signPoseidon(privateKey, BigInt(message))

        expect(signature.R8[0]).toBe(circomlibSignature.R8[0].toString())
        expect(signature.R8[1]).toBe(circomlibSignature.R8[1].toString())
        expect(signature.S).toBe(circomlibSignature.S.toString())
    })

    it("Should sign a message (buffer)", async () => {
        const message = Buffer.from("message")

        const signature = signMessage(privateKey, message)

        const circomlibSignature = eddsa.signPoseidon(privateKey, BigInt(`0x${message.toString("hex")}`))

        expect(signature.R8[0]).toBe(circomlibSignature.R8[0].toString())
        expect(signature.R8[1]).toBe(circomlibSignature.R8[1].toString())
        expect(signature.S).toBe(circomlibSignature.S.toString())
    })

    it("Should sign a message (string)", async () => {
        const message = "message"

        const signature = signMessage(privateKey, message)

        const circomlibSignature = eddsa.signPoseidon(privateKey, BigInt(`0x${Buffer.from(message).toString("hex")}`))

        expect(signature.R8[0]).toBe(circomlibSignature.R8[0].toString())
        expect(signature.R8[1]).toBe(circomlibSignature.R8[1].toString())
        expect(signature.S).toBe(circomlibSignature.S.toString())
    })

    it("Should throw an error if the message type is not supported", async () => {
        const message = true

        const fun = () => signMessage(privateKey, message as any)

        expect(fun).toThrow("Invalid message type.")
    })

    it("Should verify a signature", async () => {
        const publicKey = generatePublicKey(privateKey)
        const signature = signMessage(privateKey, message)

        expect(verifySignature(message, signature, publicKey)).toBeTruthy()
    })

    it("Should not verify a signature if the public key is malformed", async () => {
        const publicKey = generatePublicKey(privateKey)
        const signature = signMessage(privateKey, message)

        publicKey[1] = 3 as any

        expect(verifySignature(message, signature, publicKey)).toBeFalsy()
    })

    it("Should not verify a signature if the signature is malformed", async () => {
        const publicKey = generatePublicKey(privateKey)
        const signature = signMessage(privateKey, message)

        signature.S = 3 as any

        expect(verifySignature(message, signature, publicKey)).toBeFalsy()
    })

    it("Should not verify a signature if the signature is not on the curve", async () => {
        const publicKey = generatePublicKey(privateKey)
        const signature = signMessage(privateKey, message)

        signature.R8[1] = BigInt(3).toString()

        expect(verifySignature(message, signature, publicKey)).toBeFalsy()
    })

    it("Should not verify a signature if the public key is not on the curve", async () => {
        const publicKey = generatePublicKey(privateKey)
        const signature = signMessage(privateKey, message)

        publicKey[1] = BigInt(3).toString()

        expect(verifySignature(message, signature, publicKey)).toBeFalsy()
    })

    it("Should not verify a signature S value exceeds the predefined sub order", async () => {
        const publicKey = generatePublicKey(privateKey)
        const signature = signMessage(privateKey, message)

        signature.S = "3421888242871839275222246405745257275088614511777268538073601725287587578984328"

        expect(verifySignature(message, signature, publicKey)).toBeFalsy()
    })

    it("Should derive a public key from N random private keys", async () => {
        for (let i = 0, len = 10; i < len; i += 1) {
            const privateKey = crypto.randomBytes(32)

            const publicKey = generatePublicKey(privateKey)

            const circomlibPublicKey = eddsa.prv2pub(privateKey)

            expect(publicKey[0]).toBe(circomlibPublicKey[0].toString())
            expect(publicKey[1]).toBe(circomlibPublicKey[1].toString())
        }
    })
})
