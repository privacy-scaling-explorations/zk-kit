import { prove } from "@zk-kit/groth16"
import type { NumericString } from "snarkjs"
import packProof from "./packProof"
import { PoseidonProof, SnarkArtifacts } from "./types"

/**
 */
export default async function generate(
    message: NumericString,
    scope: NumericString,
    snarkArtifacts?: SnarkArtifacts
): Promise<PoseidonProof> {
    if (!snarkArtifacts) {
        snarkArtifacts = {
            wasmFilePath: "https://zkkit.cedoor.dev/poseidon-proof.zkey",
            zkeyFilePath: "https://zkkit.cedoor.dev/poseidon-proof.zkey"
        }
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
