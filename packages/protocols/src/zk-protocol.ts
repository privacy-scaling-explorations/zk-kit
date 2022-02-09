/* istanbul ignore file */
import { groth16 } from "snarkjs"
import { FullProof, SolidityProof } from "./types"

export default class ZkProtocol {
  /**
   * Generates a SnarkJS full proof with Groth16.
   * @param witness The parameters for creating the proof.
   * @param wasmFilePath The WASM file path.
   * @param finalZkeyPath The ZKey file path.
   * @returns The full SnarkJS proof.
   */
  public static async genProof(witness: any, wasmFilePath: string, finalZkeyPath: string): Promise<FullProof> {
    const { proof, publicSignals } = await groth16.fullProve(witness, wasmFilePath, finalZkeyPath, null)
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

    return groth16.verify(verificationKey, publicSignals, proof)
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
