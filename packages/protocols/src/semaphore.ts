import { keccak256 } from "@ethersproject/solidity"
import { formatBytes32String } from "@ethersproject/strings"
import { MerkleProof } from "@zk-kit/incremental-merkle-tree"
import { poseidon } from "circomlibjs"
import { groth16 } from "snarkjs"
import { Proof, SemaphoreFullProof, SemaphoreSolidityProof, SemaphoreWitness, StrBigInt } from "./types"

export default class Semaphore {
  /**
   * Generates a SnarkJS full proof with Groth16.
   * @param witness The parameters for creating the proof.
   * @param wasmFilePath The WASM file path.
   * @param finalZkeyPath The ZKey file path.
   * @returns The full SnarkJS proof.
   */
  /* istanbul ignore next */
  public static async genProof(witness: any, wasmFilePath: string, finalZkeyPath: string): Promise<SemaphoreFullProof> {
    const { proof, publicSignals } = await groth16.fullProve(witness, wasmFilePath, finalZkeyPath, null)

    return {
      proof,
      publicSignals: {
        merkleRoot: publicSignals[0],
        nullifierHash: publicSignals[1],
        signalHash: publicSignals[2],
        externalNullifier: publicSignals[3]
      }
    }
  }

  /**
   * Verifies a zero-knowledge SnarkJS proof.
   * @param verificationKey The zero-knowledge verification key.
   * @param fullProof The SnarkJS full proof.
   * @returns True if the proof is valid, false otherwise.
   */
  /* istanbul ignore next */
  public static verifyProof(verificationKey: string, { proof, publicSignals }: SemaphoreFullProof): Promise<boolean> {
    return groth16.verify(
      verificationKey,
      [
        publicSignals.merkleRoot,
        publicSignals.nullifierHash,
        publicSignals.signalHash,
        publicSignals.externalNullifier
      ],
      proof
    )
  }

  /**
   * Creates a Semaphore witness for the Semaphore ZK proof.
   * @param identityTrapdoor The identity trapdoor.
   * @param identityNullifier The identity nullifier.
   * @param merkleProof The Merkle proof that identity exists in Semaphore tree.
   * @param externalNullifier The topic on which vote should be broadcasted.
   * @param signal The signal that should be broadcasted.
   * @param shouldHash True if the signal must be hashed before broadcast.
   * @returns The Semaphore witness.
   */
  public static genWitness(
    identityTrapdoor: StrBigInt,
    identityNullifier: StrBigInt,
    merkleProof: MerkleProof,
    externalNullifier: StrBigInt,
    signal: string
  ): SemaphoreWitness {
    return {
      identityNullifier,
      identityTrapdoor,
      treePathIndices: merkleProof.pathIndices,
      treeSiblings: merkleProof.siblings,
      externalNullifier,
      signalHash: Semaphore.genSignalHash(signal)
    }
  }

  /**
   * Generates a nullifier by hashing the external and the identity nullifiers.
   * @param externalNullifier The external nullifier.
   * @param identityNullifier The identity nullifier.
   * @returns The nullifier hash.
   */
  public static genNullifierHash(externalNullifier: StrBigInt, identityNullifier: StrBigInt): bigint {
    return poseidon([BigInt(externalNullifier), BigInt(identityNullifier)])
  }

  /**
   * Hashes a signal string with Keccak256.
   * @param signal The Semaphore signal.
   * @returns The signal hash.
   */
  public static genSignalHash(signal: string): bigint {
    return BigInt(keccak256(["bytes32"], [formatBytes32String(signal)])) >> BigInt(8)
  }

  /**
   * Converts a full proof in a proof compatible with the Verifier.sol method inputs.
   * @param fullProof The proof generated with SnarkJS.
   * @returns The Solidity compatible proof.
   */
  /* istanbul ignore next */
  public static packToSolidityProof(proof: Proof): SemaphoreSolidityProof {
    return [
      proof.pi_a[0],
      proof.pi_a[1],
      proof.pi_b[0][1],
      proof.pi_b[0][0],
      proof.pi_b[1][1],
      proof.pi_b[1][0],
      proof.pi_c[0],
      proof.pi_c[1]
    ]
  }
}
