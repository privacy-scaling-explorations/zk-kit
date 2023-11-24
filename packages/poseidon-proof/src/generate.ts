import { prove } from "@zk-kit/groth16"
import download from "download"
import fs from "fs"
import tmp from "tmp"
import { defaultSnarkArtifacts, libraryName } from "./config"
import packProof from "./packProof"
import { BigNumberish, PoseidonProof, SnarkArtifacts } from "./types"
import { isBrowser, isNode } from "./utils"

/**
 * Creates a zero-knowledge proof to prove that you have the pre-image or
 * the original message of a hash, without disclosing the actual message itself.
 * The use of a scope parameter along with a nullifier helps ensure the uniqueness
 * and non-reusability of the proofs, enhancing security in applications like
 * blockchain transactions or private data verification.
 * If, for example, this package were used with Semaphore to demonstrate possession
 * of a Semaphore identity of a group of voters, the scope could be the poll's ID.
 * @param message The message (or pre-image) of the hash.
 * @param scope A public value used to contextualize the cryptographic proof
 * and calculate the nullifier.
 * @param snarkArtifacts The Snark artifacts (wasm and zkey files) generated in
 * a trusted setup of the circuit are necessary to generate valid proofs
 * @returns The Poseidon zero-knowledge proof.
 */
export default async function generate(
    message: BigNumberish,
    scope: BigNumberish,
    snarkArtifacts?: SnarkArtifacts
): Promise<PoseidonProof> {
    // If the Snark artifacts are not defined they will be automatically downloaded.
    /* istanbul ignore next */
    if (!snarkArtifacts) {
        if (isNode()) {
            const tmpDir = libraryName
            const tmpPath = `${tmp.tmpdir}/${tmpDir}`

            if (!fs.existsSync(tmpPath)) {
                tmp.dirSync({ name: tmpDir })

                await download(defaultSnarkArtifacts.wasmFilePath, tmpPath)
                await download(defaultSnarkArtifacts.zkeyFilePath, tmpPath)
            }

            snarkArtifacts = {
                wasmFilePath: `${tmpPath}/poseidon-proof.wasm`,
                zkeyFilePath: `${tmpPath}/poseidon-proof.zkey`
            }
        }

        if (isBrowser()) {
            snarkArtifacts = defaultSnarkArtifacts
        }
    }

    /* istanbul ignore next */
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
        scope: publicSignals[2],
        hash: publicSignals[1],
        nullifier: publicSignals[0],
        proof: packProof(proof)
    }
}
