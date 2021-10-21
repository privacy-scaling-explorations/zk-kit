import { ZkProtocol } from "./zk-protocol"
import { genSignalHash, poseidonHash } from "./utils"
import { Fq } from "./utils"

class Rln extends ZkProtocol {
  /**
   * Creates witness for rln proof
   * @param identitySecret identity secret
   * @param merkleProof merkle proof that identity exists in rln tree
   * @param epoch epoch on which signal is broadcasted
   * @param signal signal that is being broadcasted
   * @param rlnIdentifier unique identifier of rln dapp
   * @param shouldHash should signal be hashed before broadcast
   * @returns rln witness
   */
  genWitness(
    identitySecret: bigint,
    merkleProof: any,
    epoch: string | bigint,
    signal: string,
    rlnIdentifier: bigint,
    shouldHash = true
  ): any {
    return {
      identity_secret: identitySecret,
      path_elements: merkleProof.pathElements,
      identity_path_index: merkleProof.indices,
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
  calculateOutput(identitySecret: bigint, epoch: bigint, rlnIdentifier: bigint, x: bigint): Array<bigint> {
    const a1: bigint = poseidonHash([identitySecret, epoch, rlnIdentifier])
    const y: bigint = Fq.normalize(a1 * x + identitySecret)
    const nullifier = this.genNullifier(a1, rlnIdentifier)
    return [y, nullifier]
  }

  /**
   *
   * @param a1 y = a1 * x + a0 (a1 = poseidonHash(identity secret, epoch, rlnIdentifier))
   * @param rlnIdentifier unique identifier of rln dapp
   * @returns rln slashing nullifier
   */
  genNullifier(a1: bigint, rlnIdentifier: bigint): bigint {
    return poseidonHash([a1, rlnIdentifier])
  }

  /**
   * When spam occurs, identity secret can be retrieved
   * @param x1 x1
   * @param x2 x2
   * @param y1 y1
   * @param y2 y2
   * @returns identity secret
   */
  retrieveSecret(x1: bigint, x2: bigint, y1: bigint, y2: bigint): bigint {
    const slope = Fq.div(Fq.sub(y2, y1), Fq.sub(x2, x1))
    const privateKey = Fq.sub(y1, Fq.mul(slope, x1))
    return Fq.normalize(privateKey)
  }

  /**
   *
   * @returns unique identifier of rln dapp
   */

  genIdentifier(): bigint {
    return Fq.random()
  }
}

export default new Rln()
