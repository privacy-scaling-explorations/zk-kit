import { buildBn128 } from "@zk-kit/groth16"
import generate from "./generate"
import verify from "./verify"
import packProof from "./packProof"
import { PoseidonProof } from "./types"
import unpackProof from "./unpackProof"

describe("PoseidonProof", () => {
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
            fullProof = await generate(3, scope)

            expect(typeof fullProof).toBe("object")
        })
    })

    describe("# verify", () => {
        it("Should verify a Semaphore proof", async () => {
            const response = await verify(fullProof)

            expect(response).toBe(true)
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
