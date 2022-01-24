import { SecretType, ZkIdentity } from "@zk-kit/identity"
import * as fs from "fs"
import * as path from "path"
import { RLN } from "../src"
import { generateMerkleProof, genExternalNullifier, genSignalHash } from "../src/utils"

describe("RLN", () => {
  const zkeyFiles = "./packages/protocols/zkeyFiles"
  const identityCommitments: bigint[] = []

  beforeAll(() => {
    const numberOfLeaves = 3

    for (let i = 0; i < numberOfLeaves; i += 1) {
      const identity = new ZkIdentity()
      const identityCommitment = identity.genIdentityCommitment(SecretType.MULTIPART)

      identityCommitments.push(identityCommitment)
    }
  })

  describe("RLN functionalities", () => {
    it("Should generate rln witness", () => {
      const identity = new ZkIdentity()
      const identityCommitment = identity.genIdentityCommitment()
      const secretHash = identity.getMultipartSecretHash()

      const leaves = Object.assign([], identityCommitments)
      leaves.push(identityCommitment)

      const signal = "hey hey"
      const epoch: string = genExternalNullifier("test-epoch")
      const rlnIdentifier = RLN.genIdentifier()

      const merkleProof = generateMerkleProof(15, BigInt(0), 2, leaves, identityCommitment)
      const witness = RLN.genWitness(secretHash, merkleProof, epoch, signal, rlnIdentifier)

      expect(typeof witness).toBe("object")
    })

    it("Should generate rln proof and verify it", async () => {
      const identity = new ZkIdentity()
      const secretHash = identity.getMultipartSecretHash()
      const identityCommitment = identity.genIdentityCommitment(SecretType.MULTIPART)

      const leaves = Object.assign([], identityCommitments)
      leaves.push(identityCommitment)

      const signal = "hey hey"
      const signalHash = genSignalHash(signal)
      const epoch = genExternalNullifier("test-epoch")
      const rlnIdentifier = RLN.genIdentifier()

      const merkleProof = generateMerkleProof(15, BigInt(0), 2, leaves, identityCommitment)
      const witness = RLN.genWitness(secretHash, merkleProof, epoch, signal, rlnIdentifier)

      const [y, nullifier] = RLN.calculateOutput(secretHash, BigInt(epoch), rlnIdentifier, signalHash)
      const publicSignals = [y, merkleProof.root, nullifier, signalHash, epoch, rlnIdentifier]

      const vkeyPath = path.join(zkeyFiles, "rln", "verification_key.json")
      const vKey = JSON.parse(fs.readFileSync(vkeyPath, "utf-8"))

      const wasmFilePath = path.join(zkeyFiles, "rln", "rln.wasm")
      const finalZkeyPath = path.join(zkeyFiles, "rln", "rln_final.zkey")

      const fullProof = await RLN.genProof(witness, wasmFilePath, finalZkeyPath)
      const response = await RLN.verifyProof(vKey, { proof: fullProof.proof, publicSignals })

      expect(response).toBe(true)
    }, 30000)

    it("Should retrieve user secret after spaming", () => {
      const identity = new ZkIdentity()
      const secretHash = identity.getSecretHash()

      const signal1 = "hey hey"
      const signalHash1 = genSignalHash(signal1)
      const signal2 = "hey hey again"
      const signalHash2 = genSignalHash(signal2)

      const epoch = genExternalNullifier("test-epoch")
      const rlnIdentifier = RLN.genIdentifier()

      const [y1] = RLN.calculateOutput(secretHash, BigInt(epoch), rlnIdentifier, signalHash1)
      const [y2] = RLN.calculateOutput(secretHash, BigInt(epoch), rlnIdentifier, signalHash2)

      const retrievedSecret = RLN.retrieveSecret(signalHash1, signalHash2, y1, y2)

      expect(retrievedSecret).toEqual(secretHash)
    })
  })
})
