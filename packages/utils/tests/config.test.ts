import { getZkkitArtifactUrl, GetArtifactUrl } from "../src/get-snark-artifacts/config"
import { ArtifactType, ProofType } from "../src/types"

describe("getZkkitArtifactUrl", () => {
    it("should return the correct Zk-kit artifact urls", () => {
        expect(getZkkitArtifactUrl(ProofType.POSEIDON, ArtifactType.WASM, 2)).toMatchInlineSnapshot(
            `"https://zkkit.cedoor.dev/poseidon-proof/artifacts/2/poseidon-proof.wasm"`
        )
        expect(getZkkitArtifactUrl(ProofType.POSEIDON, ArtifactType.ZKEY, 4)).toMatchInlineSnapshot(
            `"https://zkkit.cedoor.dev/poseidon-proof/artifacts/4/poseidon-proof.zkey"`
        )
    })
})

describe("GetArtifactUrl", () => {
    it("should return the correct artifact urls for a given host url", () => {
        const getSemaphoreArtifactUrl = GetArtifactUrl("https://semaphore.cedoor.dev")
        expect(getSemaphoreArtifactUrl(ProofType.POSEIDON, ArtifactType.WASM, 2)).toMatchInlineSnapshot(
            `"https://semaphore.cedoor.dev/poseidon-proof/artifacts/2/poseidon-proof.wasm"`
        )
        expect(getSemaphoreArtifactUrl(ProofType.POSEIDON, ArtifactType.ZKEY, 4)).toMatchInlineSnapshot(
            `"https://semaphore.cedoor.dev/poseidon-proof/artifacts/4/poseidon-proof.zkey"`
        )
    })
})
