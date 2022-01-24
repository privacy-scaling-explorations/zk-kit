import { MerkleProof, StrBigInt } from "@zk-kit/types"
import { poseidon } from "circomlibjs"
import { Fq, genSignalHash } from "./utils"
import ZkProtocol from "./zk-protocol"

export default class RLN extends ZkProtocol {
  /**
   * Creates witness for rln proof
   * @param identitySecret identity secret
   * @param merkleProof merkle proof that identity exists in RLN tree
   * @param epoch epoch on which signal is broadcasted
   * @param signal signal that is being broadcasted
   * @param rlnIdentifier identifier used by each separate app, needed for more accurate spam filtering
   * @param shouldHash should signal be hashed before broadcast
   * @returns rln witness
   */
  public static genWitness(
    identitySecret: bigint,
    merkleProof: MerkleProof,
    epoch: StrBigInt,
    signal: string,
    rlnIdentifier: bigint,
    shouldHash = true
  ): any {
    return {
      identity_secret: identitySecret,
      path_elements: merkleProof.siblings,
      identity_path_index: merkleProof.pathIndices,
      x: shouldHash ? genSignalHash(signal) : signal,
      epoch,
      rln_identifier: rlnIdentifier
    }
  }

  /**
   * Calculates
   * @param identitySecret identity secret
   * @param epoch epoch on which signal is broadcasted
   * @param rlnIdentifier unique identifier of rln dapp
   * @param x signal hash
   * @returns y & slashing nullfier
   */
  public static calculateOutput(identitySecret: bigint, epoch: bigint, rlnIdentifier: bigint, x: bigint): bigint[] {
    const a1 = poseidon([identitySecret, epoch])
    const y = Fq.normalize(a1 * x + identitySecret)
    const nullifier = RLN.genNullifier(a1, rlnIdentifier)

    return [y, nullifier]
  }

  /**
   *
   * @param a1 y = a1 * x + a0 (a1 = poseidon(identity secret, epoch, rlnIdentifier))
   * @param rlnIdentifier unique identifier of rln dapp
   * @returns rln slashing nullifier
   */
  public static genNullifier(a1: bigint, rlnIdentifier: bigint): bigint {
    return poseidon([a1, rlnIdentifier])
  }

  /**
   * When spam occurs, identity secret can be retrieved
   * @param x1 x1
   * @param x2 x2
   * @param y1 y1
   * @param y2 y2
   * @returns identity secret
   */
  public static retrieveSecret(x1: bigint, x2: bigint, y1: bigint, y2: bigint): bigint {
    const slope = Fq.div(Fq.sub(y2, y1), Fq.sub(x2, x1))
    const privateKey = Fq.sub(y1, Fq.mul(slope, x1))

    return Fq.normalize(privateKey)
  }

  /**
   *
   * @returns unique identifier of the rln dapp
   */
  public static genIdentifier(): bigint {
    return Fq.random()
  }
}
