import { FullProof, MerkleProof } from "@zk-kit/types"
import * as fs from "fs"
import * as path from "path"
import { SecretType, ZkIdentity } from "@zk-kit/identity"
import { RLN } from "../src"
import { generateMerkleProof, genExternalNullifier, genSignalHash } from "../src/utils"

const identityCommitments: Array<bigint> = []

beforeAll(() => {
  const leafIndex = 3

  for (let i = 0; i < leafIndex; i += 1) {
    const tmpIdentity = new ZkIdentity()
    const tmpCommitment: bigint = tmpIdentity.genIdentityCommitment(SecretType.MULTIPART)
    identityCommitments.push(tmpCommitment)
  }
})

describe("RLN tests", () => {
  describe("RLN functionalities", () => {
    it("Generate rln witness", () => {
      const identity: ZkIdentity = new ZkIdentity()
      const identityCommitment: bigint = identity.genIdentityCommitment()
      const secretHash: bigint = identity.getMultipartSecretHash()

      const commitments: Array<bigint> = Object.assign([], identityCommitments)
      commitments.push(identityCommitment)

      const signal = "hey hey"
      const epoch: string = genExternalNullifier("test-epoch")
      const rlnIdentifier: bigint = RLN.genIdentifier()

      const merkleProof: MerkleProof = generateMerkleProof(15, BigInt(0), 2, commitments, identityCommitment)
      const witness: FullProof = RLN.genWitness(secretHash, merkleProof, epoch, signal, rlnIdentifier)

      expect(typeof witness).toBe("object")
    })
    it.skip("Generate rln proof and verify it", async () => {
      /**
       * Compiled RLN circuits are needed to run this test so it's being skipped in hooks
       */
      const identity: ZkIdentity = new ZkIdentity()
      const secretHash: bigint = identity.getMultipartSecretHash()

      const identityCommitment: bigint = identity.genIdentityCommitment(SecretType.MULTIPART)

      const commitments: Array<bigint> = Object.assign([], identityCommitments)
      commitments.push(identityCommitment)

      const signal = "hey hey"
      const signalHash = genSignalHash(signal)
      const epoch: string = genExternalNullifier("test-epoch")
      const rlnIdentifier: bigint = RLN.genIdentifier()

      const merkleProof: MerkleProof = generateMerkleProof(15, BigInt(0), 2, commitments, identityCommitment)
      const witness: FullProof = RLN.genWitness(secretHash, merkleProof, epoch, signal, rlnIdentifier)

      const [y, nullifier] = RLN.calculateOutput(secretHash, BigInt(epoch), rlnIdentifier, signalHash)
      const publicSignals = [y, merkleProof.root, nullifier, signalHash, epoch, rlnIdentifier]

      const vkeyPath: string = path.join("./zkeyFiles", "rln", "verification_key.json")
      const vKey = JSON.parse(fs.readFileSync(vkeyPath, "utf-8"))

      const wasmFilePath: string = path.join("./zkeyFiles", "rln", "rln.wasm")
      const finalZkeyPath: string = path.join("./zkeyFiles", "rln", "rln_final.zkey")

      const fullProof: FullProof = await RLN.genProof(witness, wasmFilePath, finalZkeyPath)
      const res: boolean = await RLN.verifyProof(vKey, { proof: fullProof.proof, publicSignals })

      expect(res).toBe(true)
    }, 30000)
    it("Should retrieve user secret after spaming", () => {
      const identity: ZkIdentity = new ZkIdentity()
      const secretHash: bigint = identity.getSecretHash()

      const signal1 = "hey hey"
      const signalHash1 = genSignalHash(signal1)
      const signal2 = "hey hey again"
      const signalHash2 = genSignalHash(signal2)

      const epoch: string = genExternalNullifier("test-epoch")
      const rlnIdentifier: bigint = RLN.genIdentifier()

      const [y1] = RLN.calculateOutput(secretHash, BigInt(epoch), rlnIdentifier, signalHash1)
      const [y2] = RLN.calculateOutput(secretHash, BigInt(epoch), rlnIdentifier, signalHash2)

      const retrievedSecret: bigint = RLN.retrieveSecret(signalHash1, signalHash2, y1, y2)

      expect(retrievedSecret).toEqual(secretHash)
    })
  })
})
