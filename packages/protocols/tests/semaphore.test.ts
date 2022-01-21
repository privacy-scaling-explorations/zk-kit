import { ZkIdentity } from "@zk-kit/identity"
import { FullProof } from "@zk-kit/types"
import fs from "fs"
import path from "path"
import { Semaphore } from "../src"
import { generateMerkleProof, genExternalNullifier, genSignalHash } from "../src/utils"

describe("Semaphore", () => {
  describe("Generate and verify proof", () => {
    it("Should generate a Semaphore witness", async () => {
      const identity = new ZkIdentity()
      const identityCommitment = identity.genIdentityCommitment()
      const externalNullifier = genExternalNullifier("voting_1")
      const leaves = [BigInt(3), BigInt(2), identityCommitment, BigInt(4)]
      const signal = "0x111"

      const merkleProof = generateMerkleProof(20, BigInt(0), 5, leaves, identityCommitment)

      const witness = Semaphore.genWitness(
        identity.getTrapdoor(),
        identity.getNullifier(),
        merkleProof,
        externalNullifier,
        signal
      )

      expect(typeof witness).toBe("object")
    })

    // Compiled Semaphore circuits are needed to run this test, so it's being skipped in hooks.
    it.skip("Should generate semaphore full proof", async () => {
      const identity = new ZkIdentity()
      const identityCommitment = identity.genIdentityCommitment()
      const externalNullifier = genExternalNullifier("voting_1")
      const leaves = [BigInt(3), BigInt(2), identityCommitment, BigInt(4)]
      const signal = "0x111"

      const merkleProof = generateMerkleProof(20, BigInt(0), 5, leaves, identityCommitment)

      const witness = Semaphore.genWitness(
        identity.getTrapdoor(),
        identity.getNullifier(),
        merkleProof,
        externalNullifier,
        signal
      )

      const wasmFilePath: string = path.join("./zkeyFiles", "semaphore", "semaphore.wasm")
      const finalZkeyPath: string = path.join("./zkeyFiles", "semaphore", "semaphore_final.zkey")
      const fullProof: FullProof = await Semaphore.genProof(witness, wasmFilePath, finalZkeyPath)

      const vkeyPath: string = path.join("./zkeyFiles", "semaphore", "verification_key.json")
      const vKey = JSON.parse(fs.readFileSync(vkeyPath, "utf-8"))
      const nullifierHash = Semaphore.genNullifierHash(externalNullifier, identity.getNullifier())
      const publicSignals = [merkleProof.root.toString(), nullifierHash, genSignalHash(signal), externalNullifier]

      const res: boolean = await Semaphore.verifyProof(vKey, { proof: fullProof.proof, publicSignals })

      expect(res).toBe(true)
    }, 30000)
  })
})
