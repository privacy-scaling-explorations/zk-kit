/* istanbul ignore file */
import { groth16 } from "snarkjs"
import { FullProof, PublicSignals, SolidityProof, StrBigInt } from "./types"

export default class ZkProtocol {
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

    if (publicSignalsArray.length !== ZkProtocol.PUBLIC_SIGNALS_COUNT) throw new Error("Error while generating proof")

    const publicSignals: PublicSignals = {
      yShare: publicSignalsArray[0],
      merkleRoot: publicSignalsArray[1],
      internalNullifier: publicSignalsArray[2],
      signalHash: publicSignalsArray[3],
      epoch: publicSignalsArray[4],
      rlnIdentifier: publicSignalsArray[5]
    }

    return { proof, publicSignals }
  }

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
