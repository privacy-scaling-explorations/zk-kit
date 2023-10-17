import { verify, prove, buildBn128 } from "../src"
import verificationKey from "../snark-artifacts/index.json"

describe("Groth16", () => {
    const wasmFilePath = "./packages/groth16/snark-artifacts/index.wasm"
    const zkeyFilePath = "./packages/groth16/snark-artifacts/index.zkey"

    let curve: any
    let proof: any

    beforeAll(async () => {
        curve = await buildBn128()
    })

    afterAll(async () => {
        await curve.terminate()
    })

    it("Should generate a proof", async () => {
        proof = await prove(
            {
                message: 12,
                scope: 122
            },
            wasmFilePath,
            zkeyFilePath
        )

        expect(typeof proof).toBe("object")
    }, 20000)

    it("Should verify a valid proof", async () => {
        const response = await verify(verificationKey, proof)

        expect(response).toBe(true)
    })

    it("Should verify an invalid proof", async () => {
        proof.publicSignals[0] = 0

        const response = await verify(verificationKey, proof)

        expect(response).toBe(false)
    })
})
