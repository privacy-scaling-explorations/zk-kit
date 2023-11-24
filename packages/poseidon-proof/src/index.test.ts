import { buildBn128 } from "@zk-kit/groth16"
import { poseidon2, poseidon1 } from "poseidon-lite"
import generate from "./generate"
import packProof from "./packProof"
import { PoseidonProof } from "./types"
import unpackProof from "./unpackProof"
import verify from "./verify"

describe("PoseidonProof", () => {
    const scope = 1
    const message = 2

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
            fullProof = await generate(message, scope)

            const hash = poseidon1([message])
            const nullifier = poseidon2([scope, message])

            expect(fullProof.proof).toHaveLength(8)
            expect(fullProof.scope).toBe(scope.toString())
            expect(fullProof.hash).toBe(hash.toString())
            expect(fullProof.nullifier).toBe(nullifier.toString())
        })
    })

    describe("# verify", () => {
        it("Should verify a valid Poseidon proof", async () => {
            const response = await verify(fullProof)

            expect(response).toBe(true)
        })

        it("Should verify an invalid Poseidon proof", async () => {
            fullProof.hash = "3"

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
