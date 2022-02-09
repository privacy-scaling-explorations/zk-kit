import { MerkleProof } from "@zk-kit/incremental-merkle-tree"
import { poseidon } from "circomlibjs"
import { SemaphoreWitness, StrBigInt } from "./types"
import { genSignalHash } from "./utils"
import ZkProtocol from "./zk-protocol"

export default class Semaphore extends ZkProtocol {
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
      identity_nullifier: identityNullifier,
      identity_trapdoor: identityTrapdoor,
      identity_path_index: merkleProof.pathIndices,
      path_elements: merkleProof.siblings,
      external_nullifier: externalNullifier,
      signal_hash: shouldHash ? genSignalHash(signal) : signal
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
