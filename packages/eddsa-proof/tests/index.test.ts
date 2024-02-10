import { buildBn128 } from "@zk-kit/groth16"
import { poseidon2 } from "poseidon-lite"
import { derivePublicKey } from "@zk-kit/eddsa-poseidon"
import generate from "../src/generate"
import packProof from "../src/pack-proof"
import { EddsaProof } from "../src/types"
import unpackProof from "../src/unpack-proof"
import verify from "../src/verify"

describe("EddsaProof", () => {
    const privateKey = 2
    const scope = 1

    let fullProof: EddsaProof
    let curve: any

    beforeAll(async () => {
        curve = await buildBn128()
    })

    afterAll(async () => {
        await curve.terminate()
    })

    describe("# generate", () => {
        it("Should generate an Eddsa proof", async () => {
            fullProof = await generate(privateKey, scope)

            const publicKey = derivePublicKey(privateKey)

            const commitment = poseidon2(publicKey)

            expect(fullProof.proof).toHaveLength(8)
            expect(fullProof.scope).toBe(scope.toString())
            expect(fullProof.commitment).toBe(commitment.toString())
        })
    })

    describe("# verify", () => {
        it("Should verify a valid Eddsa proof", async () => {
            const response = await verify(fullProof)

            expect(response).toBe(true)
        })

        it("Should verify an invalid Eddsa proof", async () => {
            fullProof.commitment = "3"

            const response = await verify(fullProof)

            expect(response).toBe(false)
        })
    })

    describe("# packProof/unpackProof", () => {
        it("Should return a packed proof", async () => {
            const originalProof = unpackProof(fullProof.proof)
            const proof = packProof(originalProof)

            expect(proof).toStrictEqual(fullProof.proof)
        })
    })
})
