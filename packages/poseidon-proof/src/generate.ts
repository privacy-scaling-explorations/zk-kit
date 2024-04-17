import { BigNumber } from "@ethersproject/bignumber"
import { BytesLike, Hexable } from "@ethersproject/bytes"
import { NumericString, groth16 } from "snarkjs"
import { packGroth16Proof, maybeGetPoseidonSnarkArtifacts, SnarkArtifacts } from "@zk-kit/utils"
import hash from "./hash"
import { PoseidonProof } from "./types"

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
 * @returns The Poseidon zero-knowledge proof.
 */
export default async function generate(
    preimages: Array<BytesLike | Hexable | number | bigint>,
    scope: BytesLike | Hexable | number | bigint,
    snarkArtifacts?: SnarkArtifacts
): Promise<PoseidonProof> {
    // allow user to override our artifacts
    // if not explicitly provided: download them from unpkg if not already in local tmp folder
    snarkArtifacts ??= await maybeGetPoseidonSnarkArtifacts(preimages.length)
    const { wasm, zkey } = snarkArtifacts

    const { proof, publicSignals } = await groth16.fullProve(
        {
            preimages: preimages.map((preimage) => hash(preimage)),
            scope: hash(scope)
        },
        wasm,
        zkey
    )

    return {
        scope: BigNumber.from(scope).toString() as NumericString,
        digest: publicSignals[0],
        proof: packGroth16Proof(proof)
    }
}
