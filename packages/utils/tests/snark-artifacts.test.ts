import fs from "node:fs"
import fsPromises from "node:fs/promises"
import Project from "../src/snark-artifacts/projects"
import maybeGetSnarkArtifacts from "../src/snark-artifacts/snark-artifacts.node"

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

    it("Should throw an error if the project is not supported", async () => {
        await expect(
            maybeGetSnarkArtifacts("project" as Project, { parameters: ["2"], version: "latest" })
        ).rejects.toThrow("Project 'project' is not supported")
    })

    it("Should throw on fetch errors", async () => {
        existsSyncSpy.mockReturnValue(false)
        fetchSpy.mockResolvedValueOnce({
            ok: false,
            statusText: "TEST"
        })

        await expect(
            maybeGetSnarkArtifacts(Project.POSEIDON, { parameters: ["2"], version: "latest" })
        ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"Failed to fetch https://unpkg.com/@zk-kit/poseidon-artifacts@latest/poseidon-2.wasm: TEST"`
        )
    })

    it("Should throw if missing body", async () => {
        existsSyncSpy.mockReturnValue(false)
        fetchSpy.mockResolvedValueOnce({
            ok: true,
            statusText: "OK"
        })

        await expect(
            maybeGetSnarkArtifacts(Project.POSEIDON, { parameters: ["2"], version: "0.1.0-beta" })
        ).rejects.toThrowErrorMatchingInlineSnapshot(`"Failed to get response body"`)
    })

    it("Should throw on stream error", async () => {
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

        await expect(
            maybeGetSnarkArtifacts(Project.POSEIDON, { parameters: ["2"], version: "0.1.0-beta.1" })
        ).rejects.toThrowErrorMatchingInlineSnapshot(`"TEST STREAM ERROR"`)
    })

    it("Should download files only if don't exist yet", async () => {
        existsSyncSpy.mockReturnValue(true)

        await maybeGetSnarkArtifacts(Project.POSEIDON, { parameters: ["2"] })

        expect(global.fetch).not.toHaveBeenCalled()
    })

    it("Should return artifact file paths", async () => {
        mkdirSpy.mockRestore()
        existsSyncSpy.mockReturnValue(false)

        const { wasm, zkey } = await maybeGetSnarkArtifacts(Project.POSEIDON, { parameters: ["2"] })

        expect(wasm).toMatchInlineSnapshot(`"/tmp/@zk-kit/poseidon-artifacts@latest/poseidon-2.wasm"`)
        expect(zkey).toMatchInlineSnapshot(`"/tmp/@zk-kit/poseidon-artifacts@latest/poseidon-2.zkey"`)
        expect(fetchSpy).toHaveBeenCalledTimes(2)
    }, 20_000)
})
