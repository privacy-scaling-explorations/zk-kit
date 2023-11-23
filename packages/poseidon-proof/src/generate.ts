import { prove } from "@zk-kit/groth16"
import { defaultSnarkArtifacts, libraryName } from "./config"
import packProof from "./packProof"
import { BigNumberish, PoseidonProof, SnarkArtifacts } from "./types"
import { isBrowser, isNode } from "./utils"

/**
 */
export default async function generate(
    message: BigNumberish,
    scope: BigNumberish,
    snarkArtifacts?: SnarkArtifacts
): Promise<PoseidonProof> {
    if (!snarkArtifacts) {
        if (isNode()) {
            const { default: download } = await import("download")
            const { default: tmp } = await import("tmp")
            const fs = await import("fs")

            const tmpDir = libraryName
            const tmpPath = `${tmp.tmpdir}/${tmpDir}`

            if (!fs.existsSync(tmpPath)) {
                tmp.dirSync({ name: tmpDir })
            }

            await download(defaultSnarkArtifacts.wasmFilePath, tmpPath)
            await download(defaultSnarkArtifacts.zkeyFilePath, tmpPath)

            snarkArtifacts = {
                wasmFilePath: `${tmpPath}/poseidon-proof.wasm`,
                zkeyFilePath: `${tmpPath}/poseidon-proof.zkey`
            }
        }

        if (isBrowser()) {
            snarkArtifacts = defaultSnarkArtifacts
        }
    }

    if (!snarkArtifacts) {
        throw new Error("Error: Missing Snark artifacts. Please ensure all necessary Snark artifacts are included.")
    }

    const { proof, publicSignals } = await prove(
        {
            in: message,
            scope
        },
        snarkArtifacts.wasmFilePath,
        snarkArtifacts.zkeyFilePath
    )

    return {
        scope: publicSignals[0],
        hash: publicSignals[1],
        nullifier: publicSignals[2],
        proof: packProof(proof)
    }
}
