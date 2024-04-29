import { buildBn128 } from "@zk-kit/groth16"
import { decodeBytes32String, toBeHex } from "ethers"
import generate from "../src/generate"
import hash from "../src/hash"
import { PoseidonProof } from "../src/types"
import verify from "../src/verify"

const scope = "scope"
const proofs: Array<{ fullProof: PoseidonProof; digest: bigint }> = []
let curve: any

beforeAll(async () => {
    curve = await buildBn128()
    await Promise.all(
        [...Array(16).keys()].map(async (i) => {
            i += 1
            const preimages = [...Array(i).keys()].map((j) => j + 1)
            const fullProofPromise = generate(preimages, scope)
            await new Promise((resolve) => {
                setTimeout(resolve, 500)
            })
            const poseidonModulePromise = import("poseidon-lite")
            const [poseidonModule, fullProof] = await Promise.all([poseidonModulePromise, fullProofPromise])
            // @ts-ignore
            const poseidon = poseidonModule[`poseidon${i}`]
            const digest = poseidon(preimages.map((preimage) => hash(preimage)))
            proofs.push({ fullProof, digest })
        })
    )
}, 30_000)

afterAll(async () => {
    await curve.terminate()
})

describe("PoseidonProof", () => {
    it("should generate a Poseidon proof from 1 to 16 preimages", async () => {
        for (const { fullProof, digest } of proofs) {
            expect(fullProof.proof).toHaveLength(8)
            expect(decodeBytes32String(toBeHex(fullProof.scope, 32))).toBe(scope.toString())
            expect(fullProof.digest).toBe(digest.toString())
        }
    })

    it("Should verify a Poseidon proof from 1 to 16 preimage(s)", async () => {
        proofs.forEach(async ({ fullProof }) => {
            await expect(verify(fullProof)).resolves.toBe(true)
        })
    })

    it("Should verify an invalid Poseidon proof", async () => {
        const { fullProof } = proofs[0]
        fullProof.digest = "3"

        const response = await verify(fullProof)

        expect(response).toBe(false)
    })
})
