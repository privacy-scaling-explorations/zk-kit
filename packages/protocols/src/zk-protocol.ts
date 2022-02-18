/* istanbul ignore file */
import { groth16 } from "snarkjs"
import { FullProof, SolidityProof, StrBigInt } from "./types"

export default class ZkProtocol {
  /**
   * Verifies a zero-knowledge SnarkJS proof.
   * @param verificationKey The zero-knowledge verification key.
   * @param fullProof The SnarkJS full proof.
   * @returns True if the proof is valid, false otherwise.
   */
  public static verifyProof(verificationKey: string, fullProof: FullProof): Promise<boolean> {
    const { proof, publicSignals } = fullProof

    const publicSignalsArray: StrBigInt[] = Object.values(publicSignals)

    return groth16.verify(verificationKey, publicSignalsArray, proof)
  }

  /**
   * Converts a full proof in a proof compatible with the Verifier.sol method inputs.
   * @param fullProof The proof generated with SnarkJS.
   * @returns The Solidity compatible proof.
   */
  public static packToSolidityProof(fullProof: FullProof): SolidityProof {
    const { proof } = fullProof

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
