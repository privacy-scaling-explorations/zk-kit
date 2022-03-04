import { ZkIdentity } from "@zk-kit/identity"
import { getCurveFromName } from "ffjavascript"
import * as fs from "fs"
import * as path from "path"
import { RLN } from "../src"
import { generateMerkleProof, genExternalNullifier } from "../src/utils"

describe("RLN", () => {
  const zkeyFiles = "./packages/protocols/zkeyFiles"
  const identityCommitments: bigint[] = []

  let curve: any

  beforeAll(async () => {
    curve = await getCurveFromName("bn128")

    const numberOfLeaves = 3

    for (let i = 0; i < numberOfLeaves; i += 1) {
      const identity = new ZkIdentity()
      const identityCommitment = identity.genIdentityCommitment()

      identityCommitments.push(identityCommitment)
    }
  })

  afterAll(async () => {
    await curve.terminate()
  })

  describe("RLN functionalities", () => {
    it("Should generate rln witness", () => {
      const identity = new ZkIdentity()
      const identityCommitment = identity.genIdentityCommitment()
      const secretHash = identity.getSecretHash()

      const leaves = Object.assign([], identityCommitments)
      leaves.push(identityCommitment)

      const signal = "hey hey"
      const epoch: string = genExternalNullifier("test-epoch")
      const rlnIdentifier = RLN.genIdentifier()

      const merkleProof = generateMerkleProof(15, BigInt(0), leaves, identityCommitment)
      const witness = RLN.genWitness(secretHash, merkleProof, epoch, signal, rlnIdentifier)

      expect(typeof witness).toBe("object")
    })

    it("Should throw an exception for a zero leaf", () => {
      const zeroIdCommitment = BigInt(0)
      const leaves = Object.assign([], identityCommitments)
      leaves.push(zeroIdCommitment)

      const fun = () => generateMerkleProof(15, zeroIdCommitment, leaves, zeroIdCommitment)

      expect(fun).toThrow("Can't generate a proof for a zero leaf")
    })

    it("Should retrieve user secret after spaming", () => {
      const identity = new ZkIdentity()
      const secretHash = identity.getSecretHash()

      const signal1 = "hey hey"
      const signalHash1 = RLN.genSignalHash(signal1)
      const signal2 = "hey hey again"
      const signalHash2 = RLN.genSignalHash(signal2)

      const epoch = genExternalNullifier("test-epoch")
      const rlnIdentifier = RLN.genIdentifier()

      const [y1] = RLN.calculateOutput(secretHash, BigInt(epoch), rlnIdentifier, signalHash1)
      const [y2] = RLN.calculateOutput(secretHash, BigInt(epoch), rlnIdentifier, signalHash2)

      const retrievedSecret = RLN.retrieveSecret(signalHash1, signalHash2, y1, y2)

      expect(retrievedSecret).toEqual(secretHash)
    })

    // eslint-disable-next-line jest/no-disabled-tests
    it.skip("Should generate and verify RLN proof", async () => {
      const identity = new ZkIdentity()
      const secretHash = identity.getSecretHash()
      const identityCommitment = identity.genIdentityCommitment()

      const leaves = Object.assign([], identityCommitments)
      leaves.push(identityCommitment)

      const signal = "hey hey"
      const epoch = genExternalNullifier("test-epoch")
      const rlnIdentifier = RLN.genIdentifier()

      const merkleProof = generateMerkleProof(15, BigInt(0), leaves, identityCommitment)
      const witness = RLN.genWitness(secretHash, merkleProof, epoch, signal, rlnIdentifier)

      const vkeyPath = path.join(zkeyFiles, "rln", "verification_key.json")
      const vKey = JSON.parse(fs.readFileSync(vkeyPath, "utf-8"))

      const wasmFilePath = path.join(zkeyFiles, "rln", "rln.wasm")
      const finalZkeyPath = path.join(zkeyFiles, "rln", "rln_final.zkey")

      const fullProof = await RLN.genProof(witness, wasmFilePath, finalZkeyPath)
      const response = await RLN.verifyProof(vKey, fullProof)

      expect(response).toBe(true)
    }, 30000)
  })
})
