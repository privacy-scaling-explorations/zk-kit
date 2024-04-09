import { getZkkitArtifactUrl, GetSnarkArtifactUrl } from "../src/get-snark-artifacts/config"
import { ArtifactType, ProofType } from "../src/types"

describe("getZkkitArtifactUrl", () => {
    it("should throw if invalid numberOfInputs is provided for a first ProofType.POSEIDON argument", () => {
        // @ts-expect-error function overloads don't allow this anyway, bypass just for extra testing
        expect(() => getZkkitArtifactUrl(ProofType.POSEIDON, ArtifactType.WASM)).toThrowErrorMatchingInlineSnapshot(
            `"numberOfInputs is required for Poseidon proof"`
        )
        expect(() => getZkkitArtifactUrl(ProofType.POSEIDON, ArtifactType.WASM, 0)).toThrowErrorMatchingInlineSnapshot(
            `"numberOfInputs must be greater than 0"`
        )
    })

    it("should return the correct Zk-kit artifact urls", () => {
        expect(getZkkitArtifactUrl(ProofType.POSEIDON, ArtifactType.WASM, 2)).toMatchInlineSnapshot(
            `"https://zkkit.cedoor.dev/poseidon-proof/artifacts/2/poseidon-proof.wasm"`
        )
        expect(getZkkitArtifactUrl(ProofType.POSEIDON, ArtifactType.ZKEY, 4)).toMatchInlineSnapshot(
            `"https://zkkit.cedoor.dev/poseidon-proof/artifacts/4/poseidon-proof.zkey"`
        )
    })
})

describe("GetSnarkArtifactUrl", () => {
    it("should return the correct artifact urls for a given host url", () => {
        const getSemaphoreArtifactUrl = GetSnarkArtifactUrl("https://semaphore.cedoor.dev")
        expect(getSemaphoreArtifactUrl(ProofType.POSEIDON, ArtifactType.WASM, 2)).toMatchInlineSnapshot(
            `"https://semaphore.cedoor.dev/poseidon-proof/artifacts/2/poseidon-proof.wasm"`
        )
        expect(getSemaphoreArtifactUrl(ProofType.POSEIDON, ArtifactType.ZKEY, 4)).toMatchInlineSnapshot(
            `"https://semaphore.cedoor.dev/poseidon-proof/artifacts/4/poseidon-proof.zkey"`
        )
        expect(getSemaphoreArtifactUrl(ProofType.EDDSA, ArtifactType.WASM)).toMatchInlineSnapshot(
            `"https://semaphore.cedoor.dev/eddsa/artifacts/eddsa-proof.wasm"`
        )
    })
})
