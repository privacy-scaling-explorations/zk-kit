/* istanbul ignore file */

import { SnarkArtifacts } from "./types"

export default async function getSnarkArtifacts(numberOfInputs: number): Promise<SnarkArtifacts> {
    return {
        wasmFilePath: `https://zkkit.cedoor.dev/poseidon-proof/artifacts/${numberOfInputs}/poseidon-proof.wasm`,
        zkeyFilePath: `https://zkkit.cedoor.dev/poseidon-proof/artifacts/${numberOfInputs}/poseidon-proof.zkey`
    }
}
