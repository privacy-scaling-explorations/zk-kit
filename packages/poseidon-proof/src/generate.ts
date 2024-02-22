import { BigNumber } from "@ethersproject/bignumber"
import { BytesLike, Hexable } from "@ethersproject/bytes"
import { NumericString, groth16 } from "snarkjs"
import getSnarkArtifacts from "./get-snark-artifacts.node"
import hash from "./hash"
import packProof from "./pack-proof"
import { PoseidonProof, SnarkArtifacts } from "./types"

/**
 * Creates a zero-knowledge proof to prove that you have the preimages of a hash,
 * without disclosing the actual preimages themselves.
 * The use of a scope parameter helps ensure the uniqueness
 * and non-reusability of the proofs, enhancing security in applications like
 * blockchain transactions or private data verification.
 * If, for example, this package were used with Semaphore to demonstrate possession
 * of a Semaphore identity of a group of voters, the scope could be the poll's ID.
 * @param preimages The preimages of the hash.
 * @param scope A public value used to contextualize the cryptographic proof
 * and calculate the nullifier.
 * @param snarkArtifacts The Snark artifacts (wasm and zkey files) generated in
 * a trusted setup of the circuit are necessary to generate valid proofs
 * @returns The Poseidon zero-knowledge proof.
 */
export default async function generate(
    preimages: Array<BytesLike | Hexable | number | bigint>,
    scope: BytesLike | Hexable | number | bigint,
    snarkArtifacts?: SnarkArtifacts
): Promise<PoseidonProof> {
    // If the Snark artifacts are not defined they will be automatically downloaded.
    /* istanbul ignore next */
    if (!snarkArtifacts) {
        snarkArtifacts = await getSnarkArtifacts(preimages.length)
    }

    const { proof, publicSignals } = await groth16.fullProve(
        {
            preimages: preimages.map((preimage) => hash(preimage)),
            scope: hash(scope)
        },
        snarkArtifacts.wasmFilePath,
        snarkArtifacts.zkeyFilePath
    )

    return {
        scope: BigNumber.from(scope).toString() as NumericString,
        digest: publicSignals[0],
        proof: packProof(proof)
    }
}
