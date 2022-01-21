import { MerkleProof } from "@zk-kit/types"
import { poseidon } from "circomlibjs"
import { Fq, genSignalHash } from "./utils"
import ZkProtocol from "./zk-protocol"

export default class NRLN extends ZkProtocol {
  /**
   * Creates witness for RLN proof
   * @param identitySecret identity secret
   * @param merkleProof merkle proof that identity exists in RLN tree
   * @param epoch epoch on which signal is broadcasted
   * @param signal signal that is being broadcasted
   * @param rlnIdentifier identifier used by each separate app, needed for more accurate spam filtering
   * @param shouldHash should signal be hashed before broadcast
   * @returns rln witness
   */
  public static genWitness(
    identitySecret: Array<bigint>,
    merkleProof: MerkleProof,
    epoch: string | bigint,
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
   *
   * @param identitySecret identity secret
   * @param epoch epoch
   * @param x singal hash
   * @param limit number of messages per epoch allowed
   * @param rlnIdentifier identifier used by each separate app, needed for more accurate spam filtering
   * @returns
   */
  public static calculateOutput(
    identitySecret: Array<bigint>,
    epoch: bigint,
    x: bigint,
    limit: number,
    rlnIdentifier: bigint
  ): Array<bigint> {
    const a0 = poseidon(identitySecret)

    const coeffs: Array<bigint> = []
    let tmpX = x

    coeffs.push(poseidon([identitySecret[0], epoch]))
    let y: bigint = Fq.add(Fq.mul(coeffs[0], tmpX), a0)

    for (let i = 1; i < limit; i += 1) {
      tmpX = Fq.mul(x, tmpX)

      coeffs.push(poseidon([identitySecret[i], epoch]))
      y = Fq.add(y, Fq.mul(coeffs[i], tmpX))
    }

    coeffs.push(poseidon([rlnIdentifier]))
    const nullifier: bigint = NRLN.genNullifier(coeffs)
    return [y, nullifier]
  }

  /**
   * Calculates slashing nullifier
   * @param coeffs coeefitients from calculated polinomial
   * @returns slashing nullifier
   */
  public static genNullifier(coeffs: Array<bigint>): bigint {
    return poseidon(coeffs)
  }

  /**
   * When spam occurs, identity secret can be retrieved
   * @param xs
   * @param ys
   * @returns identity secret
   */
  public static retrieveSecret(xs: Array<bigint>, ys: Array<bigint>): bigint {
    if (xs.length !== ys.length) throw new Error("x and y arrays must be of same size")
    const numOfPoints: number = xs.length
    let f0 = BigInt(0)
    for (let i = 0; i < numOfPoints; i += 1) {
      let p = BigInt(1)
      for (let j = 0; j < numOfPoints; j += 1) {
        if (j !== i) {
          p = Fq.mul(p, Fq.div(xs[j], Fq.sub(xs[j], xs[i])))
        }
      }
      f0 = Fq.add(f0, Fq.mul(ys[i], p))
    }
    return f0
  }

  /**
   *
   * @returns unique identifier of the rln dapp
   */
  public static genIdentifier(): bigint {
    return Fq.random()
  }
}
