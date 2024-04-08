import { createWriteStream, existsSync } from "node:fs"
import { mkdir } from "node:fs/promises"
import { getEddsaSnarkArtifacts, getPoseidonSnarkArtifacts } from "../src/get-snark-artifacts.node"

jest.mock("node:fs", () => ({
    ...jest.requireActual("node:fs"),
    createWriteStream: jest.fn(),
    existsSync: jest.fn()
}))

jest.mock("node:fs/promises", () => ({
    ...jest.requireActual("node:fs/promises"),
    mkdir: jest.fn()
}))

global.fetch = jest.fn()

beforeEach(() => {
    jest.resetAllMocks()
    ;(mkdir as jest.Mock).mockResolvedValue(undefined)
})

describe("getPoseidonSnarkArtifacts", () => {
    it("should handle fetch errors", async () => {
        ;(existsSync as jest.Mock).mockReturnValue(false)
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            statusText: "TEST"
        })
        await expect(getPoseidonSnarkArtifacts(2)).rejects.toThrowErrorMatchingInlineSnapshot(
            `"Failed to fetch https://zkkit.cedoor.dev/poseidon-proof/artifacts/2/poseidon-proof/poseidon-proof.wasm: TEST"`
        )
    })

    it("should download files only if don't exist yet", async () => {
        ;(existsSync as jest.Mock).mockReturnValue(true)
        await getPoseidonSnarkArtifacts(2)
        expect(global.fetch).not.toHaveBeenCalled()
    })

    it("should return artifact filePaths", async () => {
        ;(existsSync as jest.Mock).mockReturnValue(false)
        const mockResponseStream = {
            body: {
                getReader: jest.fn(() => ({
                    read: jest
                        .fn()
                        .mockResolvedValueOnce({ done: false, value: "test data" })
                        .mockResolvedValueOnce({ done: true })
                }))
            },
            ok: true,
            statusText: "OK"
        }
        ;(global.fetch as jest.Mock).mockResolvedValue(mockResponseStream)
        ;(createWriteStream as jest.Mock).mockReturnValue({
            close: jest.fn(),
            end: jest.fn(),
            write: jest.fn()
        })
        await expect(getPoseidonSnarkArtifacts(2)).resolves.toMatchInlineSnapshot(`
            {
              "wasmPath": "/tmp/poseidon-proof-2/poseidon-proof.wasm",
              "zkeyPath": "/tmp/poseidon-proof-2/poseidon-proof.zkey",
            }
        `)

        expect(existsSync).toHaveBeenCalledTimes(2)
        expect(mkdir).toHaveBeenCalledTimes(2)
        expect(global.fetch).toHaveBeenCalledTimes(2)
        expect(mockResponseStream.body.getReader).toHaveBeenCalledTimes(2)
        expect(createWriteStream).toHaveBeenCalledTimes(2)
    })
})

describe("getEddsaSnarkArtifacts", () => {
    it("should handle fetch errors", async () => {
        ;(existsSync as jest.Mock).mockReturnValue(false)
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            statusText: "TEST"
        })
        await expect(getEddsaSnarkArtifacts()).rejects.toThrowErrorMatchingInlineSnapshot(
            `"Failed to fetch https://zkkit.cedoor.dev/eddsa-proof/eddsa-proof.wasm: TEST"`
        )
    })

    it("should download files only if don't exist yet", async () => {
        ;(existsSync as jest.Mock).mockReturnValue(true)
        await getPoseidonSnarkArtifacts(2)
        expect(global.fetch).not.toHaveBeenCalled()
    })

    it("should return artifact filePaths", async () => {
        ;(existsSync as jest.Mock).mockReturnValue(false)
        const mockResponseStream = {
            body: {
                getReader: jest.fn(() => ({
                    read: jest
                        .fn()
                        .mockResolvedValueOnce({ done: false, value: "test data" })
                        .mockResolvedValueOnce({ done: true })
                }))
            },
            ok: true,
            statusText: "OK"
        }
        ;(global.fetch as jest.Mock).mockResolvedValue(mockResponseStream)
        ;(createWriteStream as jest.Mock).mockReturnValue({
            close: jest.fn(),
            end: jest.fn(),
            write: jest.fn()
        })
        await expect(getEddsaSnarkArtifacts()).resolves.toMatchInlineSnapshot(`
            {
              "wasmPath": "/tmp/eddsa-proof/eddsa-proof.wasm",
              "zkeyPath": "/tmp/eddsa-proof/eddsa-proof.zkey",
            }
        `)

        expect(existsSync).toHaveBeenCalledTimes(2)
        expect(mkdir).toHaveBeenCalledTimes(2)
        expect(global.fetch).toHaveBeenCalledTimes(2)
        expect(mockResponseStream.body.getReader).toHaveBeenCalledTimes(2)
        expect(createWriteStream).toHaveBeenCalledTimes(2)
    })
})
