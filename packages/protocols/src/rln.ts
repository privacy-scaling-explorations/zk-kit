import { hexlify } from "@ethersproject/bytes"
import { keccak256 } from "@ethersproject/solidity"
import { toUtf8Bytes } from "@ethersproject/strings"
import { MerkleProof } from "@zk-kit/incremental-merkle-tree"
import { poseidon } from "circomlibjs"
import { groth16 } from "snarkjs"
import { RLNFullProof, StrBigInt } from "./types"
import { Fq } from "./utils"

export default class RLN {
  /**
   * Generates a SnarkJS full proof with Groth16.
   * @param witness The parameters for creating the proof.
   * @param wasmFilePath The WASM file path.
   * @param finalZkeyPath The ZKey file path.
   * @returns The full SnarkJS proof.
   */
  /* istanbul ignore next */
  public static async genProof(witness: any, wasmFilePath: string, finalZkeyPath: string): Promise<RLNFullProof> {
    const { proof, publicSignals } = await groth16.fullProve(witness, wasmFilePath, finalZkeyPath, null)

    return {
      proof,
      publicSignals: {
        yShare: publicSignals[0],
        merkleRoot: publicSignals[1],
        internalNullifier: publicSignals[2],
        signalHash: publicSignals[3],
        epoch: publicSignals[4],
        rlnIdentifier: publicSignals[5]
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
  public static verifyProof(verificationKey: string, { proof, publicSignals }: RLNFullProof): Promise<boolean> {
    return groth16.verify(
      verificationKey,
      [
        publicSignals.yShare,
        publicSignals.merkleRoot,
        publicSignals.internalNullifier,
        publicSignals.signalHash,
        publicSignals.epoch,
        publicSignals.rlnIdentifier
      ],
      proof
    )
  }

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
      x: shouldHash ? RLN.genSignalHash(signal) : signal,
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
   * Hashes a signal string with Keccak256.
   * @param signal The RLN signal.
   * @returns The signal hash.
   */
  public static genSignalHash(signal: string): bigint {
    const converted = hexlify(toUtf8Bytes(signal))

    return BigInt(keccak256(["bytes"], [converted])) >> BigInt(8)
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
