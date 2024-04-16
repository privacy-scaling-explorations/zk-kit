import { GetSnarkArtifactUrls } from "../src/get-snark-artifacts/config"
import { Artifact, Proof } from "../src/types"

describe("GetSnarkArtifactUrls", () => {
    it("should throw if proof type is unknown", async () => {
        await expect(
            GetSnarkArtifactUrls({
                // @ts-expect-error type checking prevents this, bypassing for explicit testing
                proof: "unknown" as Proof
            })
        ).rejects.toThrowErrorMatchingInlineSnapshot(`"Unknown proof type"`)
    })

    it("should default to latest version", async () => {
        const urls = await GetSnarkArtifactUrls({ proof: Proof.EDDSA })

        expect(urls.get(Artifact.WASM)).toMatchInlineSnapshot(
            `"https://unpkg.com/@zk-kit/eddsa-artifacts@latest/eddsa.wasm"`
        )
        expect(urls.get(Artifact.ZKEY)).toMatchInlineSnapshot(
            `"https://unpkg.com/@zk-kit/eddsa-artifacts@latest/eddsa.zkey"`
        )
    })

    it("should throw if version is not available", async () => {
        global.fetch = jest.fn()
        ;(fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({ versions: { "0.0.1": {} } })
        })

        await expect(
            GetSnarkArtifactUrls({ proof: Proof.EDDSA, version: "0.1.0" })
        ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"Version 0.1.0 is not available for eddsa proofs, available versions are: 0.0.1"`
        )
        expect(fetch).toHaveBeenCalledTimes(1)
        expect(fetch).toHaveBeenCalledWith("https://unpkg.com/@zk-kit/eddsa-artifacts")
    })

    describe("EdDSA artifacts", () => {
        it("should return the correct artifact URLs for an EdDSA proof", async () => {
            const urls = await GetSnarkArtifactUrls({ proof: Proof.EDDSA })

            expect(urls.get(Artifact.WASM)).toMatchInlineSnapshot(
                `"https://unpkg.com/@zk-kit/eddsa-artifacts@latest/eddsa.wasm"`
            )
            expect(urls.get(Artifact.ZKEY)).toMatchInlineSnapshot(
                `"https://unpkg.com/@zk-kit/eddsa-artifacts@latest/eddsa.zkey"`
            )
        })
    })

    describe("Semaphore artifacts", () => {
        it("should return the correct artifact URLs for a Semaphore proof", async () => {
            const urls = await GetSnarkArtifactUrls({ proof: Proof.SEMAPHORE, treeDepth: 2 })

            expect(urls.get(Artifact.WASM)).toMatchInlineSnapshot(
                `"https://unpkg.com/@zk-kit/semaphore-artifacts@latest/semaphore-2.wasm"`
            )
            expect(urls.get(Artifact.ZKEY)).toMatchInlineSnapshot(
                `"https://unpkg.com/@zk-kit/semaphore-artifacts@latest/semaphore-2.zkey"`
            )
        })

        it("should throw if treeDepth is not provided for a Semaphore proof", async () => {
            await expect(
                // @ts-expect-error expect-error function overloading prevents this, bypassing for extra explicit testing
                GetSnarkArtifactUrls({ artifact: Artifact.WASM, proof: Proof.SEMAPHORE })
            ).rejects.toThrowErrorMatchingInlineSnapshot(`"treeDepth is required for Semaphore proof"`)
        })

        it("should throw if treeDepth is less than 1 for Semaphore proof", async () => {
            await expect(
                GetSnarkArtifactUrls({
                    proof: Proof.SEMAPHORE,
                    treeDepth: 0
                })
            ).rejects.toThrowErrorMatchingInlineSnapshot(`"treeDepth must be greater than 0"`)
        })
    })

    describe("Poseidon artifacts", () => {
        it("should return the correct artifact URLs for a Poseidon proof", async () => {
            const urls = await GetSnarkArtifactUrls({ proof: Proof.POSEIDON, numberOfInputs: 3 })

            expect(urls.get(Artifact.WASM)).toMatchInlineSnapshot(
                `"https://unpkg.com/@zk-kit/poseidon-artifacts@latest/poseidon-3.wasm"`
            )
            expect(urls.get(Artifact.ZKEY)).toMatchInlineSnapshot(
                `"https://unpkg.com/@zk-kit/poseidon-artifacts@latest/poseidon-3.zkey"`
            )
        })
        it("should throw if numberOfInputs is not provided for Poseidon proof", async () => {
            await expect(
                // @ts-expect-error expect-error type checking prevents this, bypassing for extra explicit testing
                GetSnarkArtifactUrls({ proof: Proof.POSEIDON })
            ).rejects.toThrowErrorMatchingInlineSnapshot(`"numberOfInputs is required for Poseidon proof"`)
        })

        it("should throw if numberOfInputs is less than 1 for Poseidon proof", async () => {
            await expect(
                GetSnarkArtifactUrls({
                    proof: Proof.POSEIDON,
                    numberOfInputs: 0
                })
            ).rejects.toThrowErrorMatchingInlineSnapshot(`"numberOfInputs must be greater than 0"`)
        })
    })
})
