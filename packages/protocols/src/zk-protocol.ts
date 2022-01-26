import { FullProof, SolidityProof } from "@zk-kit/types"
import { groth16 } from "snarkjs"
import { getFileBuffer } from "./utils"
import { builder } from "./witness_calculator"

export default class ZkProtocol {
  /**
   * Generates a SnarkJS full proof with Groth16.
   * @param witness The parameters for creating the proof.
   * @param wasmFilePath The WASM file path.
   * @param finalZkeyPath The ZKey file path.
   * @returns The full SnarkJS proof.
   */
  public static async genProof(witness: any, wasmFilePath: string, finalZkeyPath: string): Promise<FullProof> {
    const wasmBuff = await getFileBuffer(wasmFilePath)
    const witnessCalculator = await builder(wasmBuff)
    const wtnsBuff = await witnessCalculator.calculateWTNSBin(witness, 0)
    const zkeyBuff = await getFileBuffer(finalZkeyPath)

    const { proof, publicSignals } = await groth16.prove(new Uint8Array(zkeyBuff), wtnsBuff, null)

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
    const { proof, publicSignals } = fullProof

    return {
      a: [proof.pi_a[0], proof.pi_a[1]],
      b: [
        [proof.pi_b[0][1], proof.pi_b[0][0]],
        [proof.pi_b[1][1], proof.pi_b[1][0]]
      ],
      c: [proof.pi_c[0], proof.pi_c[1]],
      inputs: publicSignals
    }
  }
}
