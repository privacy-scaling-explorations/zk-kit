import { MerkleProof } from "@zk-kit/incremental-merkle-tree"
import { poseidon } from "circomlibjs"
import { groth16 } from "snarkjs"
import { FullProof, StrBigInt, SemaphoreWitness, SemaphorePublicSignals } from "./types"
import { genSignalHash } from "./utils"
import ZkProtocol from "./zk-protocol"

export default class Semaphore extends ZkProtocol {
  /**
   * The number of public signals that should be returned by snarkjs when generating a proof.
   */
  private static PUBLIC_SIGNALS_COUNT: number = 6

  /**
   * Generates a SnarkJS full proof with Groth16.
   * @param witness The parameters for creating the proof.
   * @param wasmFilePath The WASM file path.
   * @param finalZkeyPath The ZKey file path.
   * @returns The full SnarkJS proof.
   */
  public static async genProof(witness: any, wasmFilePath: string, finalZkeyPath: string): Promise<FullProof> {
    const { proof, publicSignalsArray } = await groth16.fullProve(witness, wasmFilePath, finalZkeyPath, null)

    if (publicSignalsArray.length !== Semaphore.PUBLIC_SIGNALS_COUNT) throw new Error("Error while generating proof")

    const publicSignals: SemaphorePublicSignals = {
      merkleRoot: publicSignalsArray[0],
      nullifierHash: publicSignalsArray[1],
      signalHash: publicSignalsArray[2],
      externalNullifier: publicSignalsArray[3]
    }

    return { proof, publicSignals }
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
    signal: string,
    shouldHash = true
  ): SemaphoreWitness {
    return {
      identityNullifier,
      identityTrapdoor,
      treePathIndices: merkleProof.pathIndices,
      treeSiblings: merkleProof.siblings,
      externalNullifier,
      signalHash: shouldHash ? genSignalHash(signal) : signal
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
}
