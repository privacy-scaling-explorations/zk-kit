/* istanbul ignore file */
import download from "download"
import fs from "fs"
import tmp from "tmp"
import { SnarkArtifacts } from "./types"

export default async function getSnarkArtifacts(numberOfInputs: number): Promise<SnarkArtifacts> {
    const tmpDir = `poseidon-proof`
    const tmpPath = `${tmp.tmpdir}/${tmpDir}-${numberOfInputs}`

    if (!fs.existsSync(tmpPath)) {
        tmp.dirSync({ name: `${tmpDir}-${numberOfInputs}` })

        await download(
            `https://zkkit.cedoor.dev/poseidon-proof/artifacts/${numberOfInputs}/poseidon-proof.wasm`,
            tmpPath
        )
        await download(
            `https://zkkit.cedoor.dev/poseidon-proof/artifacts/${numberOfInputs}/poseidon-proof.zkey`,
            tmpPath
        )
    }

    return {
        wasmFilePath: `${tmpPath}/poseidon-proof.wasm`,
        zkeyFilePath: `${tmpPath}/poseidon-proof.zkey`
    }
}
