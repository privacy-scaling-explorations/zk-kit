import { deriveSecretScalar } from "@zk-kit/eddsa-poseidon"
import { SnarkArtifacts, maybeGetEdDSASnarkArtifacts, packGroth16Proof } from "@zk-kit/utils"
import type { BigNumberish } from "ethers"
import { NumericString, groth16 } from "snarkjs"
import hash from "./hash"
import toBigInt from "./to-bigint"
import { EddsaProof } from "./types"

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
    privateKey: Buffer | Uint8Array | string,
    scope: BigNumberish | Uint8Array | string,
    snarkArtifacts?: SnarkArtifacts
): Promise<EddsaProof> {
    scope = toBigInt(scope)

    // allow user to override our artifacts
    // otherwise they'll be downloaded if not already in local tmp folder
    snarkArtifacts ??= await maybeGetEdDSASnarkArtifacts()
    const { wasm, zkey } = snarkArtifacts
    const secretScalar = deriveSecretScalar(privateKey)

    const { proof, publicSignals } = await groth16.fullProve(
        {
            secret: secretScalar,
            scope: hash(scope)
        },
        wasm,
        zkey
    )

    return {
        commitment: publicSignals[0],
        scope: scope.toString() as NumericString,
        proof: packGroth16Proof(proof)
    }
}
