import fs from "node:fs"
import fsPromises from "node:fs/promises"
import {
    maybeGetEdDSASnarkArtifacts,
    maybeGetPoseidonSnarkArtifacts,
    maybeGetSemaphoreSnarkArtifacts
} from "../src/get-snark-artifacts/get-snark-artifacts.node"
import { Artifact } from "../src/types"

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

    it("should return artifact filePaths", async () => {
        mkdirSpy.mockRestore()
        existsSyncSpy.mockReturnValue(false)

        const { wasm, zkey } = await maybeGetPoseidonSnarkArtifacts(2)

        expect(wasm).toMatchInlineSnapshot(`"/tmp/@zk-kit/poseidon-artifacts@latest/poseidon-2.wasm"`)
        expect(zkey).toMatchInlineSnapshot(`"/tmp/@zk-kit/poseidon-artifacts@latest/poseidon-2.zkey"`)
        expect(fetchSpy).toHaveBeenCalledTimes(2)
    }, 10000)
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

        await expect(maybeGetEdDSASnarkArtifacts()).rejects.toThrowErrorMatchingInlineSnapshot(`"TEST STREAM ERROR"`)
    })

    it("should download files only if don't exist yet", async () => {
        existsSyncSpy.mockReturnValue(true)

        await maybeGetPoseidonSnarkArtifacts(2)

        expect(global.fetch).not.toHaveBeenCalled()
    })

    it("should return artifact filePaths", async () => {
        mkdirSpy.mockRestore()
        existsSyncSpy.mockReturnValue(false)

        const { wasm, zkey } = await maybeGetEdDSASnarkArtifacts()

        expect(wasm).toMatchInlineSnapshot(`"/tmp/@zk-kit/eddsa-artifacts@latest/eddsa.wasm"`)
        expect(zkey).toMatchInlineSnapshot(`"/tmp/@zk-kit/eddsa-artifacts@latest/eddsa.zkey"`)
        expect(fetchSpy).toHaveBeenCalledTimes(2)
    }, 10000)
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

    it("should return artifact filePaths", async () => {
        mkdirSpy.mockRestore()
        existsSyncSpy.mockReturnValue(false)

        const { wasm, zkey } = await maybeGetSemaphoreSnarkArtifacts(2)

        expect(wasm).toMatchInlineSnapshot(`"/tmp/@zk-kit/semaphore-artifacts@latest/semaphore-2.wasm"`)
        expect(zkey).toMatchInlineSnapshot(`"/tmp/@zk-kit/semaphore-artifacts@latest/semaphore-2.zkey"`)
        expect(fetchSpy).toHaveBeenCalledTimes(2)
    }, 10000)
})
