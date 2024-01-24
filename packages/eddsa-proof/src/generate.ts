import { BigNumber } from "@ethersproject/bignumber"
import { BytesLike, Hexable } from "@ethersproject/bytes"
import { NumericString, prove } from "@zk-kit/groth16"
import { deriveSecretScalar } from "@zk-kit/eddsa-poseidon"
import getSnarkArtifacts from "./get-snark-artifacts.node"
import hash from "./hash"
import packProof from "./pack-proof"
import { EddsaProof, SnarkArtifacts } from "./types"

/**
 * Creates a zero-knowledge proof to prove that you have the pre-image of a Semaphore commitment,
 * without disclosing the actual preimage itself.
 * The use of a scope parameter along with a nullifier helps ensure the uniqueness
 * and non-reusability of the proofs, enhancing security in applications like
 * blockchain transactions or private data verification.
 * If, for example, this package were used with Semaphore to demonstrate possession
 * of a Semaphore identity of a group of voters, the scope could be the poll's ID.
 * @param privateKey The private key of the commitment.
 * @param scope A public value used to contextualize the cryptographic proof
 * and calculate the nullifier.
 * @param snarkArtifacts The Snark artifacts (wasm and zkey files) generated in
 * a trusted setup of the circuit are necessary to generate valid proofs
 * @returns The Poseidon zero-knowledge proof.
 */
export default async function generate(
    privateKey: string | number | bigint | Buffer,
    scope: BytesLike | Hexable | number | bigint,
    snarkArtifacts?: SnarkArtifacts
): Promise<EddsaProof> {
    // If the Snark artifacts are not defined they will be automatically downloaded.
    /* istanbul ignore next */
    if (!snarkArtifacts) {
        snarkArtifacts = await getSnarkArtifacts()
    }

    const secretScalar = deriveSecretScalar(privateKey)

    const { proof, publicSignals } = await prove(
        {
            secret: secretScalar,
            scope: hash(scope)
        },
        snarkArtifacts.wasmFilePath,
        snarkArtifacts.zkeyFilePath
    )

    return {
        commitment: publicSignals[0],
        scope: BigNumber.from(scope).toString() as NumericString,
        proof: packProof(proof)
    }
}
