import { SecretType, ZkIdentity } from "@zk-kit/identity"
import { poseidon } from "circomlibjs"
import { getCurveFromName } from "ffjavascript"
import * as fs from "fs"
import * as path from "path"
import { NRLN } from "../src"
import { generateMerkleProof, genExternalNullifier, genSignalHash } from "../src/utils"

describe("NRLN", () => {
  const zkeyFiles = "./packages/protocols/zkeyFiles"
  const identityCommitments: bigint[] = []
  const SPAM_TRESHOLD = 3

  let curve: any

  beforeAll(async () => {
    curve = await getCurveFromName("bn128")

    const numberOfLeaves = 3

    for (let i = 0; i < numberOfLeaves; i += 1) {
      const identity = new ZkIdentity()
      const identityCommitment = identity.genIdentityCommitment(SecretType.MULTIPART)

      identityCommitments.push(identityCommitment)
    }
  })

  afterAll(async () => {
    await curve.terminate()
  })

  describe("NRLN features", () => {
    it("Should generate NRLN witness", () => {
      const identity = new ZkIdentity()
      const identityCommitment = identity.genIdentityCommitment(SecretType.MULTIPART, SPAM_TRESHOLD)
      const identitySecret = identity.getMultipartSecret(SPAM_TRESHOLD)

      const leaves = Object.assign([], identityCommitments)
      leaves.push(identityCommitment)

      const signal = "hey hey"
      const epoch = genExternalNullifier("test-epoch")
      const rlnIdentifier = NRLN.genIdentifier()

      const merkleProof = generateMerkleProof(15, BigInt(0), 2, leaves, identityCommitment)
      const witness = NRLN.genWitness(identitySecret, merkleProof, epoch, signal, rlnIdentifier)

      expect(typeof witness).toBe("object")
    })

    it("Should generate NRLN proof and verify it", async () => {
      const identity = new ZkIdentity()
      const identityCommitment = identity.genIdentityCommitment(SecretType.MULTIPART, SPAM_TRESHOLD)
      const identitySecret = identity.getMultipartSecret(SPAM_TRESHOLD)

      const leaves = Object.assign([], identityCommitments)
      leaves.push(identityCommitment)

      const signal = "hey hey"
      const signalHash = genSignalHash(signal)
      const epoch = genExternalNullifier("test-epoch")
      const rlnIdentifier = NRLN.genIdentifier()

      const merkleProof = generateMerkleProof(15, BigInt(0), 2, leaves, identityCommitment)
      const witness = NRLN.genWitness(identitySecret, merkleProof, epoch, signal, rlnIdentifier)

      const [y, nullifier] = NRLN.calculateOutput(
        identitySecret,
        BigInt(epoch),
        signalHash,
        SPAM_TRESHOLD,
        rlnIdentifier
      )
      const publicSignals = [y, merkleProof.root, nullifier, signalHash, epoch, rlnIdentifier]

      const vkeyPath = path.join(zkeyFiles, "nrln", "verification_key.json")
      const vKey = JSON.parse(fs.readFileSync(vkeyPath, "utf-8"))

      const wasmFilePath = path.join(zkeyFiles, "nrln", "rln.wasm")
      const finalZkeyPath = path.join(zkeyFiles, "nrln", "rln_final.zkey")

      const fullProof = await NRLN.genProof(witness, wasmFilePath, finalZkeyPath)
      const response = await NRLN.verifyProof(vKey, { proof: fullProof.proof, publicSignals })

      expect(response).toBe(true)
    }, 30000)

    it("Should retrieve user secret after spaming", () => {
      const identity = new ZkIdentity()

      const identitySecret = identity.getMultipartSecret(SPAM_TRESHOLD)

      const signal1 = "hey 1"
      const signalHash1 = genSignalHash(signal1)
      const signal2 = "hey 2"
      const signalHash2 = genSignalHash(signal2)
      const signal3 = "hey 3"
      const signalHash3 = genSignalHash(signal3)
      const signal4 = "hey 4"
      const signalHash4 = genSignalHash(signal4)

      const epoch = genExternalNullifier("test-epoch")
      const rlnIdentifier = NRLN.genIdentifier()

      const [y1] = NRLN.calculateOutput(identitySecret, BigInt(epoch), signalHash1, SPAM_TRESHOLD, rlnIdentifier)
      const [y2] = NRLN.calculateOutput(identitySecret, BigInt(epoch), signalHash2, SPAM_TRESHOLD, rlnIdentifier)
      const [y3] = NRLN.calculateOutput(identitySecret, BigInt(epoch), signalHash3, SPAM_TRESHOLD, rlnIdentifier)
      const [y4] = NRLN.calculateOutput(identitySecret, BigInt(epoch), signalHash4, SPAM_TRESHOLD, rlnIdentifier)

      const retrievedSecret = NRLN.retrieveSecret(
        [signalHash1, signalHash2, signalHash3, signalHash4],
        [y1, y2, y3, y4]
      )

      expect(retrievedSecret).toEqual(poseidon(identitySecret))
    })
  })
})
