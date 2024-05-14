import { buildBn128 } from "@zk-kit/groth16"
import { decodeBytes32String, toBeHex } from "ethers"
import { poseidon2 } from "poseidon-lite"
import generate from "../src/generate"
import hash from "../src/hash"
import { PoseidonProof } from "../src/types"
import verify from "../src/verify"

const scope = "scope"
let curve: any
let digest: bigint
let fullProof: PoseidonProof

beforeAll(async () => {
    curve = await buildBn128()

    fullProof = await generate([1, 2], scope)

    digest = poseidon2([hash(1), hash(2)])
}, 20_000)

afterAll(async () => {
    await curve.terminate()
})

describe("PoseidonProof", () => {
    it("should generate a Poseidon proof from 1 to 16 preimages", async () => {
        expect(fullProof.proof).toHaveLength(8)
        expect(decodeBytes32String(toBeHex(fullProof.scope, 32))).toBe(scope.toString())
        expect(fullProof.digest).toBe(digest.toString())
    })

    it("Should verify a Poseidon proof from 1 to 16 preimage(s)", async () => {
        await expect(verify(fullProof)).resolves.toBe(true)
    })

    it("Should verify an invalid Poseidon proof", async () => {
        fullProof.digest = "3"

        const response = await verify(fullProof)

        expect(response).toBe(false)
    })
})
