/* istanbul ignore file */
import download from "download"
import tmp from "tmp"
import fs from "fs"
import { defaultSnarkArtifacts } from "./config"

export default async function getSnarkArtifacts() {
    const tmpDir = "eddsa-proof"
    const tmpPath = `${tmp.tmpdir}/${tmpDir}`

    if (!fs.existsSync(tmpPath) || fs.readdirSync(tmpPath).length !== 2) {
        await download(defaultSnarkArtifacts.wasmFilePath, tmpPath)
        await download(defaultSnarkArtifacts.zkeyFilePath, tmpPath)
    }

    return {
        wasmFilePath: `${tmpPath}/eddsa-proof.wasm`,
        zkeyFilePath: `${tmpPath}/eddsa-proof.zkey`
    }
}
