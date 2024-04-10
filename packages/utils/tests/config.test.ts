import { GetSnarkArtifactUrl, URLS } from "../src/get-snark-artifacts/config"
import { Artifact, Proof } from "../src/types"

describe("GetSnarkArtifactUrl", () => {
    const cases = [
        {
            artifactsHostUrl: URLS.semaphore,
            proof: Proof.SEMAPHORE,
            treeDepth: 2,
            artifact: Artifact.WASM
        },
        {
            artifactsHostUrl: URLS.semaphore,
            proof: Proof.SEMAPHORE,
            treeDepth: 2,
            artifact: Artifact.ZKEY
        },
        { artifactsHostUrl: URLS.zkkit, proof: Proof.EDDSA, artifact: Artifact.WASM },
        { artifactsHostUrl: URLS.zkkit, proof: Proof.EDDSA, artifact: Artifact.ZKEY },
        { artifactsHostUrl: URLS.zkkit, proof: Proof.POSEIDON, numberOfInputs: 3, artifact: Artifact.WASM },
        { artifactsHostUrl: URLS.zkkit, proof: Proof.POSEIDON, numberOfInputs: 3, artifact: Artifact.ZKEY }
    ]

    const getTestText = ({ artifact, numberOfInputs, treeDepth, proof }: any) => {
        if (numberOfInputs) {
            return `should return the correct ${artifact} artifact URL for a ${proof} proof (${numberOfInputs} inputs)`
        }
        if (treeDepth) {
            return `should return the correct ${artifact} artifact URL for a ${proof} proof (${treeDepth} tree depth)`
        }
        return `should return the correct ${artifact} artifact URL for a ${proof} proof`
    }

    /* eslint-disable jest/valid-title */
    it(getTestText(cases[0]), () => {
        // @ts-expect-error abusing function overloading to test all cases in one test
        expect(GetSnarkArtifactUrl(cases[0])).toMatchInlineSnapshot(
            `"https://semaphore.cedoor.dev/artifacts/2/semaphore.wasm"`
        )
    })

    it(getTestText(cases[1]), () => {
        // @ts-expect-error abusing function overloading to test all cases in one test
        expect(GetSnarkArtifactUrl(cases[1])).toMatchInlineSnapshot(
            `"https://semaphore.cedoor.dev/artifacts/2/semaphore.zkey"`
        )
    })

    it(getTestText(cases[2]), () => {
        // @ts-expect-error abusing function overloading to test all cases in one test
        expect(GetSnarkArtifactUrl(cases[2])).toMatchInlineSnapshot(
            `"https://zkkit.cedoor.dev/eddsa-proof/eddsa-proof.wasm"`
        )
    })

    it(getTestText(cases[3]), () => {
        // @ts-expect-error abusing function overloading to test all cases in one test
        expect(GetSnarkArtifactUrl(cases[3])).toMatchInlineSnapshot(
            `"https://zkkit.cedoor.dev/eddsa-proof/eddsa-proof.zkey"`
        )
    })

    it(getTestText(cases[4]), () => {
        // @ts-expect-error abusing function overloading to test all cases in one test
        expect(GetSnarkArtifactUrl(cases[4])).toMatchInlineSnapshot(
            `"https://zkkit.cedoor.dev/poseidon-proof/artifacts/3/poseidon-proof.wasm"`
        )
    })

    it(getTestText(cases[5]), () => {
        // @ts-expect-error abusing function overloading to test all cases in one test
        expect(GetSnarkArtifactUrl(cases[5])).toMatchInlineSnapshot(
            `"https://zkkit.cedoor.dev/poseidon-proof/artifacts/3/poseidon-proof.zkey"`
        )
    })

    it("should throw if numberOfInputs is not provided for Poseidon proof", () => {
        expect(() =>
            // @ts-expect-error function overloading prevents this, bypassing for extra explicit testing
            GetSnarkArtifactUrl({ artifact: Artifact.WASM, artifactsHostUrl: URLS.zkkit, proof: Proof.POSEIDON })
        ).toThrowErrorMatchingInlineSnapshot(`"numberOfInputs is required for Poseidon proof"`)
    })

    it("should throw if numberOfInputs is less than 1 for Poseidon proof", () => {
        expect(() =>
            GetSnarkArtifactUrl({
                artifact: Artifact.WASM,
                artifactsHostUrl: URLS.zkkit,
                proof: Proof.POSEIDON,
                numberOfInputs: 0
            })
        ).toThrowErrorMatchingInlineSnapshot(`"numberOfInputs must be greater than 0"`)
    })

    it("should throw if treeDepth is not provided for Semaphore proof", () => {
        expect(() =>
            // @ts-expect-error function overloading prevents this, bypassing for extra explicit testing
            GetSnarkArtifactUrl({ artifact: Artifact.WASM, artifactsHostUrl: URLS.semaphore, proof: Proof.SEMAPHORE })
        ).toThrowErrorMatchingInlineSnapshot(`"treeDepth is required for Semaphore proof"`)
    })

    it("should throw if treeDepth is less than 1 for Semaphore proof", () => {
        expect(() =>
            GetSnarkArtifactUrl({
                artifact: Artifact.WASM,
                artifactsHostUrl: URLS.semaphore,
                proof: Proof.SEMAPHORE,
                treeDepth: 0
            })
        ).toThrowErrorMatchingInlineSnapshot(`"treeDepth must be greater than 0"`)
    })
})
