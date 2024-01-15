import { buildBn128 } from "@zk-kit/groth16"
import { poseidon1, poseidon2 } from "poseidon-lite"
import generate from "../src/generate"
import packProof from "../src/pack-proof"
import { EddsaProof } from "../src/types"
import unpackProof from "../src/unpack-proof"
import verify from "../src/verify"
import hash from "../src/hash"

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
        it("Should generate a Eddsa proof", async () => {
            fullProof = await generate(privateKey, scope)

            const digest = poseidon1([hash(privateKey)])
            const nullifier = poseidon2([hash(scope), hash(privateKey)])

            expect(fullProof.proof).toHaveLength(8)
            expect(fullProof.scope).toBe(scope.toString())
            expect(fullProof.commitment).toBe(digest.toString())
            expect(fullProof.nullifier).toBe(nullifier.toString())
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
