import { ZkIdentity } from "../../identity/src"
import { MerkleProof, FullProof } from "../../types"
import { genSignalHash, genExternalNullifier, generateMerkleProof } from "../src/utils"
import * as path from "path"
import * as fs from "fs"

import { Semaphore } from "../src"

const identityCommitments: Array<bigint> = []

beforeAll(() => {
  jest.useFakeTimers("legacy")
  jest.setTimeout(90 * 1000)
  const leafIndex = 3

  for (let i = 0; i < leafIndex; i++) {
    const tmpIdentity = new ZkIdentity();
    const tmpCommitment: bigint = tmpIdentity.genIdentityCommitment();
    identityCommitments.push(tmpCommitment)
  }
})

describe("Semaphore", () => {
  describe("Generate and verify proof", () => {
    it("Should generate semaphore witness", async () => {
      const identity = new ZkIdentity();
      const externalNullifier: string = genExternalNullifier("voting_1")
      const signal = "0x111"
      const identityCommitment: bigint = identity.genIdentityCommitment();

      const commitments: Array<bigint> = Object.assign([], identityCommitments)
      commitments.push(identityCommitment)

      const merkleProof: MerkleProof = generateMerkleProof(20, BigInt(0), 5, commitments, identityCommitment)
      const witness: FullProof = Semaphore.genWitness(identity.getIdentity(), merkleProof, externalNullifier, signal)

      expect(typeof witness).toBe("object")
    })
    it.skip("Should generate semaphore full proof", async () => {
      /**
       * Compiled semaphore circuits are needed to run this test, so it's being skipped in hooks
       */
      const identity = new ZkIdentity();
      const externalNullifier: string = genExternalNullifier("voting_1")
      const signal = "0x111"
      const nullifierHash: bigint = Semaphore.genNullifierHash(externalNullifier, identity.getNullifier(), 20)
      const identityCommitment: bigint = identity.genIdentityCommitment()

      const commitments: Array<bigint> = Object.assign([], identityCommitments)
      commitments.push(identityCommitment)

      const merkleProof: MerkleProof = generateMerkleProof(20, BigInt(0), 5, commitments, identityCommitment)
      const witness: FullProof = Semaphore.genWitness(identity.getIdentity(), merkleProof, externalNullifier, signal)

      const publicSignals: Array<bigint | string> = [
        merkleProof.root,
        nullifierHash,
        genSignalHash(signal),
        externalNullifier
      ]

      const vkeyPath: string = path.join("./zkeyFiles", "semaphore", "verification_key.json")
      const vKey = JSON.parse(fs.readFileSync(vkeyPath, "utf-8"))

      const wasmFilePath: string = path.join("./zkeyFiles", "semaphore", "semaphore.wasm")
      const finalZkeyPath: string = path.join("./zkeyFiles", "semaphore", "semaphore_final.zkey")

      const fullProof: FullProof = await Semaphore.genProof(witness, wasmFilePath, finalZkeyPath)
      const res: boolean = await Semaphore.verifyProof(vKey, { proof: fullProof.proof, publicSignals })

      expect(res).toBe(true)
    })
  })
})
