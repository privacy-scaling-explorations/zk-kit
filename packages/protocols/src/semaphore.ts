import { ZkProtocol } from "./zk-protocol"
import { genSignalHash, poseidonHash } from "./utils"
import { Identity, MerkleProof } from "@zk-kit/types"

class Semaphore extends ZkProtocol {
  /**
   * Creates witness for semaphore proof
   * @param identity semaphore identity
   * @param merkleProof merkle proof that identity exists in semaphore tree
   * @param externalNullifier topic on which vote should be broadcasted
   * @param signal signal that should be broadcasted
   * @param shouldHash should signal be hashed before broadcast
   * @returns
   */
  genWitness(
    identity: Identity,
    merkleProof: MerkleProof,
    externalNullifier: string | bigint,
    signal: string,
    shouldHash = true
  ): any {
    return {
      identity_nullifier: identity.identityNullifier,
      identity_trapdoor: identity.identityTrapdoor,
      identity_path_index: merkleProof.indices,
      path_elements: merkleProof.pathElements,
      external_nullifier: externalNullifier,
      signal_hash: shouldHash ? genSignalHash(signal) : signal
    }
  }

  /**
   * generates nullifier hash for semaphore proof
   * @param externalNullifier external nullifier
   * @param identityNullifier identity nullifier
   * @param nLevels depth of tree
   * @returns
   */
  genNullifierHash(externalNullifier: string | bigint, identityNullifier: string | bigint): bigint {
    return poseidonHash([BigInt(externalNullifier), BigInt(identityNullifier)])
  }
}

export default new Semaphore()
