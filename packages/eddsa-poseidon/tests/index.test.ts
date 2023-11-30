import { eddsa } from "circomlibjs"
import { generatePublicKey, signMessage, verifySignature } from "../src"

describe("EdDSAPoseidon", () => {
    const privateKey = "secret"
    const message = BigInt(2)

    it("Should derive a public key from a private key", async () => {
        const publicKey = generatePublicKey(privateKey)

        const circomlibPublicKey = eddsa.prv2pub(privateKey)

        expect(publicKey[0]).toBe(circomlibPublicKey[0])
        expect(publicKey[1]).toBe(circomlibPublicKey[1])
    })

    it("Should sign a message", async () => {
        const signature = signMessage(privateKey, message)

        const circomlibSignature = eddsa.signPoseidon(privateKey, message)

        expect(signature.R8[0]).toBe(circomlibSignature.R8[0])
        expect(signature.R8[1]).toBe(circomlibSignature.R8[1])
        expect(signature.S).toBe(circomlibSignature.S)
    })

    it("Should verify a signature", async () => {
        const publicKey = generatePublicKey(privateKey)
        const signature = signMessage(privateKey, message)

        expect(verifySignature(message, signature, publicKey)).toBeTruthy()
    })
})
