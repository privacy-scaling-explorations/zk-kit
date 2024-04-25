import fs from "node:fs"
import fsPromises from "node:fs/promises"
import {
    maybeGetEdDSASnarkArtifacts,
    maybeGetPoseidonSnarkArtifacts,
    maybeGetSemaphoreSnarkArtifacts
} from "../src/snark-artifacts/snark-artifacts.node"
import { GetSnarkArtifactUrls } from "../src/snark-artifacts/config"
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
        const { wasm, zkey } = await GetSnarkArtifactUrls({ proof: Proof.EDDSA })

        expect(wasm).toMatchInlineSnapshot(`"https://unpkg.com/@zk-kit/eddsa-artifacts@latest/eddsa.wasm"`)
        expect(zkey).toMatchInlineSnapshot(`"https://unpkg.com/@zk-kit/eddsa-artifacts@latest/eddsa.zkey"`)
    })

    it("should throw if version is not available", async () => {
        jest.spyOn(global, "fetch").mockResolvedValueOnce(
            new Response(JSON.stringify({ versions: { "0.0.1": {} } }), {
                status: 200,
                statusText: "OK",
                headers: {
                    "Content-Type": "application/json"
                }
            })
        )

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
            const { wasm, zkey } = await GetSnarkArtifactUrls({ proof: Proof.EDDSA })

            expect(wasm).toMatchInlineSnapshot(`"https://unpkg.com/@zk-kit/eddsa-artifacts@latest/eddsa.wasm"`)
            expect(zkey).toMatchInlineSnapshot(`"https://unpkg.com/@zk-kit/eddsa-artifacts@latest/eddsa.zkey"`)
        })
    })

    describe("Semaphore artifacts", () => {
        it("should return the correct artifact URLs for a Semaphore proof", async () => {
            const { wasm, zkey } = await GetSnarkArtifactUrls({ proof: Proof.SEMAPHORE, treeDepth: 2 })

            expect(wasm).toMatchInlineSnapshot(
                `"https://unpkg.com/@zk-kit/semaphore-artifacts@latest/semaphore-2.wasm"`
            )
            expect(zkey).toMatchInlineSnapshot(
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
            const { wasm, zkey } = await GetSnarkArtifactUrls({ proof: Proof.POSEIDON, numberOfInputs: 3 })

            expect(wasm).toMatchInlineSnapshot(`"https://unpkg.com/@zk-kit/poseidon-artifacts@latest/poseidon-3.wasm"`)
            expect(zkey).toMatchInlineSnapshot(`"https://unpkg.com/@zk-kit/poseidon-artifacts@latest/poseidon-3.zkey"`)
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
describe("MaybeGetSnarkArtifacts", () => {
    let fetchSpy: jest.SpyInstance
    let mkdirSpy: jest.SpyInstance
    let createWriteStreamSpy: jest.SpyInstance
    let existsSyncSpy: jest.SpyInstance

    beforeEach(() => {
        jest.restoreAllMocks()
        fetchSpy = jest.spyOn(global, "fetch")
        createWriteStreamSpy = jest.spyOn(fs, "createWriteStream")
        existsSyncSpy = jest.spyOn(fs, "existsSync")
        mkdirSpy = jest.spyOn(fsPromises, "mkdir")
        mkdirSpy.mockResolvedValue(undefined)
    })

    describe("maybeGetPoseidonSnarkArtifacts", () => {
        it("should throw on fetch errors", async () => {
            existsSyncSpy.mockReturnValue(false)
            fetchSpy.mockResolvedValueOnce({
                ok: false,
                statusText: "TEST"
            })

            await expect(maybeGetPoseidonSnarkArtifacts(2)).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Failed to fetch https://unpkg.com/@zk-kit/poseidon-artifacts@latest/poseidon-2.wasm: TEST"`
            )
        })

        it("should throw on invalid numberOfInputs", async () => {
            await expect(maybeGetPoseidonSnarkArtifacts(0)).rejects.toThrowErrorMatchingInlineSnapshot(
                `"numberOfInputs must be greater than 0"`
            )
        })

        it("should throw if missing body", async () => {
            existsSyncSpy.mockReturnValue(false)
            fetchSpy.mockResolvedValueOnce({
                ok: true,
                statusText: "OK"
            })

            await expect(maybeGetPoseidonSnarkArtifacts(2)).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Failed to get response body"`
            )
        })

        it("should throw on stream error", async () => {
            existsSyncSpy.mockReturnValue(false)
            const mockResponseStream = {
                body: {
                    getReader: jest.fn(() => ({
                        read: jest.fn().mockRejectedValueOnce(new Error("TEST STREAM ERROR"))
                    }))
                },
                ok: true,
                statusText: "OK"
            }
            fetchSpy.mockResolvedValue(mockResponseStream)
            createWriteStreamSpy.mockReturnValue({
                close: jest.fn(),
                end: jest.fn(),
                write: jest.fn()
            })

            await expect(maybeGetPoseidonSnarkArtifacts(2)).rejects.toThrowErrorMatchingInlineSnapshot(
                `"TEST STREAM ERROR"`
            )
        })

        it("should download files only if don't exist yet", async () => {
            existsSyncSpy.mockReturnValue(true)

            await maybeGetPoseidonSnarkArtifacts(2)

            expect(global.fetch).not.toHaveBeenCalled()
        })

        it("should return artifact file paths", async () => {
            mkdirSpy.mockRestore()
            existsSyncSpy.mockReturnValue(false)

            const { wasm, zkey } = await maybeGetPoseidonSnarkArtifacts(2)

            expect(wasm).toMatchInlineSnapshot(`"/tmp/@zk-kit/poseidon-artifacts@latest/poseidon-2.wasm"`)
            expect(zkey).toMatchInlineSnapshot(`"/tmp/@zk-kit/poseidon-artifacts@latest/poseidon-2.zkey"`)
            expect(fetchSpy).toHaveBeenCalledTimes(2)
        }, 20_000)
    })

    describe("maybeGetEdDSASnarkArtifacts", () => {
        it("should handle fetch errors", async () => {
            existsSyncSpy.mockReturnValue(false)
            fetchSpy.mockResolvedValueOnce({
                ok: false,
                statusText: "test error message"
            })

            await expect(maybeGetEdDSASnarkArtifacts()).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Failed to fetch https://unpkg.com/@zk-kit/eddsa-artifacts@latest/eddsa.wasm: test error message"`
            )
        })

        it("should throw if missing body", async () => {
            existsSyncSpy.mockReturnValue(false)
            fetchSpy.mockResolvedValueOnce({
                ok: true,
                statusText: "OK"
            })

            await expect(maybeGetEdDSASnarkArtifacts()).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Failed to get response body"`
            )
        })

        it("should throw on stream error", async () => {
            existsSyncSpy.mockReturnValue(false)
            const mockResponseStream = {
                body: {
                    getReader: jest.fn(() => ({
                        read: jest.fn().mockRejectedValueOnce(new Error("TEST STREAM ERROR"))
                    }))
                },
                ok: true,
                statusText: "OK"
            }
            fetchSpy.mockResolvedValue(mockResponseStream)
            createWriteStreamSpy.mockReturnValue({
                close: jest.fn(),
                end: jest.fn(),
                write: jest.fn()
            })

            await expect(maybeGetEdDSASnarkArtifacts()).rejects.toThrowErrorMatchingInlineSnapshot(
                `"TEST STREAM ERROR"`
            )
        })

        it("should download files only if don't exist yet", async () => {
            existsSyncSpy.mockReturnValue(true)

            await maybeGetPoseidonSnarkArtifacts(2)

            expect(global.fetch).not.toHaveBeenCalled()
        })

        it("should return artifact file paths", async () => {
            mkdirSpy.mockRestore()
            existsSyncSpy.mockReturnValue(false)

            const { wasm, zkey } = await maybeGetEdDSASnarkArtifacts()

            expect(wasm).toMatchInlineSnapshot(`"/tmp/@zk-kit/eddsa-artifacts@latest/eddsa.wasm"`)
            expect(zkey).toMatchInlineSnapshot(`"/tmp/@zk-kit/eddsa-artifacts@latest/eddsa.zkey"`)
            expect(fetchSpy).toHaveBeenCalledTimes(2)
        }, 20_000)
    })

    describe("maybeGetSemaphoreSnarkArtifacts", () => {
        it("should throw on fetch errors", async () => {
            existsSyncSpy.mockReturnValue(false)
            fetchSpy.mockResolvedValueOnce({
                ok: false,
                statusText: "TEST"
            })

            await expect(maybeGetSemaphoreSnarkArtifacts(2)).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Failed to fetch https://unpkg.com/@zk-kit/semaphore-artifacts@latest/semaphore-2.wasm: TEST"`
            )
        })

        it("should throw on invalid treeDepth", async () => {
            await expect(maybeGetSemaphoreSnarkArtifacts(0)).rejects.toThrowErrorMatchingInlineSnapshot(
                `"treeDepth must be greater than 0"`
            )
        })

        it("should throw if missing body", async () => {
            existsSyncSpy.mockReturnValue(false)
            fetchSpy.mockResolvedValueOnce({
                ok: true,
                statusText: "OK"
            })

            await expect(maybeGetSemaphoreSnarkArtifacts(2)).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Failed to get response body"`
            )
        })

        it("should throw on stream error", async () => {
            existsSyncSpy.mockReturnValue(false)
            const mockResponseStream = {
                body: {
                    getReader: jest.fn(() => ({
                        read: jest.fn().mockRejectedValueOnce(new Error("TEST STREAM ERROR"))
                    }))
                },
                ok: true,
                statusText: "OK"
            }
            fetchSpy.mockResolvedValue(mockResponseStream)
            createWriteStreamSpy.mockReturnValue({
                close: jest.fn(),
                end: jest.fn(),
                write: jest.fn()
            })

            await expect(maybeGetSemaphoreSnarkArtifacts(2)).rejects.toThrowErrorMatchingInlineSnapshot(
                `"TEST STREAM ERROR"`
            )
        })

        it("should download files only if don't exist yet", async () => {
            existsSyncSpy.mockReturnValue(true)

            await maybeGetSemaphoreSnarkArtifacts(2)

            expect(global.fetch).not.toHaveBeenCalled()
        })

        it("should return artifact file paths", async () => {
            mkdirSpy.mockRestore()
            existsSyncSpy.mockReturnValue(false)

            const { wasm, zkey } = await maybeGetSemaphoreSnarkArtifacts(2)

            expect(wasm).toMatchInlineSnapshot(`"/tmp/@zk-kit/semaphore-artifacts@latest/semaphore-2.wasm"`)
            expect(zkey).toMatchInlineSnapshot(`"/tmp/@zk-kit/semaphore-artifacts@latest/semaphore-2.zkey"`)
            expect(fetchSpy).toHaveBeenCalledTimes(2)
        }, 20_000)
    })
})
