import { BigNumber } from "@ethersproject/bignumber"
import { BytesLike, Hexable } from "@ethersproject/bytes"
import { NumericString, prove } from "@zk-kit/groth16"
import getSnarkArtifacts from "./get-snark-artifacts.node"
import hash from "./hash"
import packProof from "./pack-proof"
import { PoseidonProof, SnarkArtifacts } from "./types"

/**
 * Creates a zero-knowledge proof to prove that you have the pre-image of a hash,
 * without disclosing the actual preimage itself.
 * The use of a scope parameter along with a nullifier helps ensure the uniqueness
 * and non-reusability of the proofs, enhancing security in applications like
 * blockchain transactions or private data verification.
 * If, for example, this package were used with Semaphore to demonstrate possession
 * of a Semaphore identity of a group of voters, the scope could be the poll's ID.
 * @param preimage The preimage of the hash.
 * @param scope A public value used to contextualize the cryptographic proof
 * and calculate the nullifier.
 * @param snarkArtifacts The Snark artifacts (wasm and zkey files) generated in
 * a trusted setup of the circuit are necessary to generate valid proofs
 * @returns The Poseidon zero-knowledge proof.
 */
export default async function generate(
    preimage: BytesLike | Hexable | number | bigint,
    scope: BytesLike | Hexable | number | bigint,
    snarkArtifacts?: SnarkArtifacts
): Promise<PoseidonProof> {
    // If the Snark artifacts are not defined they will be automatically downloaded.
    /* istanbul ignore next */
    if (!snarkArtifacts) {
        snarkArtifacts = await getSnarkArtifacts()
    }

    const { proof, publicSignals } = await prove(
        {
            in: hash(preimage),
            scope: hash(scope)
        },
        snarkArtifacts.wasmFilePath,
        snarkArtifacts.zkeyFilePath
    )

    return {
        scope: BigNumber.from(scope).toString() as NumericString,
        digest: publicSignals[1],
        nullifier: publicSignals[0],
        proof: packProof(proof)
    }
}
