import { buildBn128 } from "@zk-kit/groth16"
import {
    poseidon1,
    poseidon2,
    poseidon3,
    poseidon4,
    poseidon5,
    poseidon6,
    poseidon7,
    poseidon8,
    poseidon9,
    poseidon10,
    poseidon11,
    poseidon12,
    poseidon13,
    poseidon14,
    poseidon15,
    poseidon16
} from "poseidon-lite"
import generate from "../src/generate"
import { PoseidonProof } from "../src/types"
import verify from "../src/verify"
import hash from "../src/hash"

const poseidonFunctions = [
    poseidon1,
    poseidon2,
    poseidon3,
    poseidon4,
    poseidon5,
    poseidon6,
    poseidon7,
    poseidon8,
    poseidon9,
    poseidon10,
    poseidon11,
    poseidon12,
    poseidon13,
    poseidon14,
    poseidon15,
    poseidon16
]

const computePoseidon = (preimages: string[]) => poseidonFunctions[preimages.length - 1](preimages)

describe("PoseidonProof", () => {
    const preimages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    const scope = 1

    let fullProof: PoseidonProof
    let curve: any

    beforeAll(async () => {
        curve = await buildBn128()
    })

    afterAll(async () => {
        await curve.terminate()
    })

    describe("# generate/verify", () => {
        it("Should generate and verify a Poseidon proof from 1 to 16 preimages", async () => {
            for (let i = 0; i < preimages.length; i += 1) {
                const currentPreimages = preimages.slice(0, i + 1)

                // Generate.
                fullProof = await generate(currentPreimages, scope)

                const digest = computePoseidon(currentPreimages.map((preimage) => hash(preimage)))

                expect(fullProof.proof).toHaveLength(8)
                expect(fullProof.scope).toBe(scope.toString())
                expect(fullProof.digest).toBe(digest.toString())

                // Verify.
                const response = await verify(currentPreimages.length, fullProof)

                expect(response).toBe(true)
            }
        }, 60000)

        it("Should verify an invalid Poseidon proof", async () => {
            fullProof.digest = "3"

            const response = await verify(preimages.length, fullProof)

            expect(response).toBe(false)
        })
    })
})
