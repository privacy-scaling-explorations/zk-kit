import { FullProof } from "@zk-kit/types"
import * as fs from "fs"
import { groth16 } from "snarkjs"
import { SNARK_FIELD_SIZE } from "./utils"
import { builder } from "./witness_calculator"

export default class ZkProtocol {
  /**
   *
   * @param input circuit inputs
   * @param wasmPath wasm path
   * @param witnessFileName where to save witness
   * @returns creates and saves witness to witnessFileName
   */
  async genWtns(input: any, wasmFilePath: string) {
    let wntsBuff: ArrayBuffer
    // window exists only in browser
    if (typeof window !== "undefined") {
      const resp = await fetch(wasmFilePath)
      wntsBuff = await resp.arrayBuffer()
    } else {
      wntsBuff = fs.readFileSync(wasmFilePath)
    }

    return new Promise((resolve, reject) => {
      builder(wntsBuff)
        .then(async (witnessCalculator) => {
          const buff = await witnessCalculator.calculateWTNSBin(input, 0)
          resolve(buff)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /**
   * Generates full proof
   * @param grothInput witness
   * @param wasmFilePath path to wasm file
   * @param finalZkeyPath path to final zkey file
   * @returns zero knowledge proof
   */
  async genProof(grothInput: any, wasmFilePath: string, finalZkeyPath: string): Promise<FullProof> {
    let zkeyBuff: ArrayBuffer
    const wtnsBuff = await this.genWtns(grothInput, wasmFilePath)
    // window exists only in browser
    if (typeof window !== "undefined") {
      const resp = await fetch(finalZkeyPath)
      zkeyBuff = await resp.arrayBuffer()
    } else {
      zkeyBuff = fs.readFileSync(finalZkeyPath)
    }

    const { proof, publicSignals } = await groth16.prove(new Uint8Array(zkeyBuff), wtnsBuff, null)
    return { proof, publicSignals }
  }

  /**
   * Verify ZK proof
   * @param vKey verifikation key
   * @param fullProof proof
   * @returns Is provided proof valid
   */
  verifyProof(vKey: string, fullProof: FullProof): Promise<boolean> {
    const { proof, publicSignals } = fullProof
    return groth16.verify(vKey, publicSignals, proof)
  }

  /**
   * Transforms proof that can be compatible with solidity input
   * @param fullProof
   * @returns Proof
   */
  packToSolidityProof(fullProof: FullProof) {
    const { proof, publicSignals } = fullProof

    return {
      a: proof.pi_a.slice(0, 2),
      b: proof.pi_b.map((x: any) => x.reverse()).slice(0, 2),
      c: proof.pi_c.slice(0, 2),
      inputs: publicSignals.map((x: any) => {
        x = BigInt(x)
        return (x % SNARK_FIELD_SIZE).toString()
      })
    }
  }
}
