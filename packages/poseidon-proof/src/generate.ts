import { BigNumber } from "@ethersproject/bignumber"
import type { SnarkArtifacts } from "@zk-kit/utils"
import { packGroth16Proof } from "@zk-kit/utils/proof-packing"
import maybeGetSnarkArtifacts from "@zk-kit/utils/snark-artifacts"
import { BigNumberish } from "ethers"
import { NumericString, groth16 } from "snarkjs"
import hash from "./hash"
import toBigInt from "./to-bigint"
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
 * @param snarkArtifacts The Snark artifacts (wasm and zkey files) generated in
 * a trusted setup of the circuit are necessary to generate valid proofs
 * @returns The Poseidon zero-knowledge proof.
 */
export default async function generate(
    preimages: Array<BigNumberish>,
    scope: BigNumberish | Uint8Array | string,
    snarkArtifacts?: SnarkArtifacts
): Promise<PoseidonProof> {
    scope = toBigInt(scope)

    // allow user to override our artifacts
    // otherwise they'll be downloaded if not already in local tmp folder
    snarkArtifacts ??= await maybeGetSnarkArtifacts("poseidon", { parameters: [preimages.length] })
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
        numberOfInputs: preimages.length,
        scope: BigNumber.from(scope).toString() as NumericString,
        digest: publicSignals[0],
        proof: packGroth16Proof(proof)
    }
}
