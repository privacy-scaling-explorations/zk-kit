import { buildBn128 } from "@zk-kit/groth16"
import { poseidon1, poseidon2 } from "poseidon-lite"
import generate from "../src/generate"
import packProof from "../src/pack-proof"
import { PoseidonProof } from "../src/types"
import unpackProof from "../src/unpack-proof"
import verify from "../src/verify"
import hash from "../src/hash"

describe("PoseidonProof", () => {
    const preimage = 2
    const scope = 1

    let fullProof: PoseidonProof
    let curve: any

    beforeAll(async () => {
        curve = await buildBn128()
    })

    afterAll(async () => {
        await curve.terminate()
    })

    describe("# generate", () => {
        it("Should generate a Poseidon proof", async () => {
            fullProof = await generate(preimage, scope)

            const digest = poseidon1([hash(preimage)])
            const nullifier = poseidon2([hash(scope), hash(preimage)])

            expect(fullProof.proof).toHaveLength(8)
            expect(fullProof.scope).toBe(scope.toString())
            expect(fullProof.digest).toBe(digest.toString())
            expect(fullProof.nullifier).toBe(nullifier.toString())
        })
    })

    describe("# verify", () => {
        it("Should verify a valid Poseidon proof", async () => {
            const response = await verify(fullProof)

            expect(response).toBe(true)
        })

        it("Should verify an invalid Poseidon proof", async () => {
            fullProof.digest = "3"

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
