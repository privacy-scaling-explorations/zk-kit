import { FullProof, MerkleProof } from "@zk-kit/types"
import * as fs from "fs"
import * as path from "path"
import { SecretType, ZkIdentity } from "@zk-kit/identity"
import { NRLN } from "../src"
import { generateMerkleProof, genExternalNullifier, genSignalHash, poseidonHash } from "../src/utils"

const identityCommitments: Array<bigint> = []
const SPAM_TRESHOLD = 3

beforeAll(() => {
  const leafIndex = 3

  for (let i = 0; i < leafIndex; i += 1) {
    const tmpIdentity = new ZkIdentity()
    const tmpCommitment: bigint = tmpIdentity.genIdentityCommitment(SecretType.MULTIPART, SPAM_TRESHOLD)
    identityCommitments.push(tmpCommitment)
  }
})

describe("NRLN", () => {
  describe("NRLN features", () => {
    it("Generate NRLN witness", () => {
      const identity: ZkIdentity = new ZkIdentity()

      const identityCommitment: bigint = identity.genIdentityCommitment(SecretType.MULTIPART, SPAM_TRESHOLD)
      const identitySecret: bigint[] = identity.getMultipartSecret(SPAM_TRESHOLD)

      const commitments: Array<bigint> = Object.assign([], identityCommitments)
      commitments.push(identityCommitment)

      const signal = "hey hey"
      const epoch: string = genExternalNullifier("test-epoch")
      const rlnIdentifier: bigint = NRLN.genIdentifier()

      const merkleProof: MerkleProof = generateMerkleProof(15, BigInt(0), 2, commitments, identityCommitment)
      const witness: FullProof = NRLN.genWitness(identitySecret, merkleProof, epoch, signal, rlnIdentifier)

      expect(typeof witness).toBe("object")
    })
    it.skip("Generate NRLN proof and verify it", async () => {
      /**
       * Compiled RLN circuits are needed to run this test so it's being skipped in hooks
       */
      const identity: ZkIdentity = new ZkIdentity()

      const identityCommitment: bigint = identity.genIdentityCommitment(SecretType.MULTIPART, SPAM_TRESHOLD)
      const identitySecret: bigint[] = identity.getMultipartSecret(SPAM_TRESHOLD)
      const commitments: Array<bigint> = Object.assign([], identityCommitments)
      commitments.push(identityCommitment)

      const signal = "hey hey"
      const signalHash = genSignalHash(signal)
      const epoch: string = genExternalNullifier("test-epoch")
      const rlnIdentifier: bigint = NRLN.genIdentifier()

      const merkleProof: MerkleProof = generateMerkleProof(15, BigInt(0), 2, commitments, identityCommitment)
      const witness: FullProof = NRLN.genWitness(identitySecret, merkleProof, epoch, signal, rlnIdentifier)

      const [y, nullifier] = NRLN.calculateOutput(
        identitySecret,
        BigInt(epoch),
        signalHash,
        SPAM_TRESHOLD,
        rlnIdentifier
      )
      const publicSignals = [y, merkleProof.root, nullifier, signalHash, epoch, rlnIdentifier]

      const vkeyPath: string = path.join("./zkeyFiles", "nrln", "verification_key.json")
      const vKey = JSON.parse(fs.readFileSync(vkeyPath, "utf-8"))

      const wasmFilePath: string = path.join("./zkeyFiles", "nrln", "rln.wasm")
      const finalZkeyPath: string = path.join("./zkeyFiles", "nrln", "rln_final.zkey")

      const fullProof: FullProof = await NRLN.genProof(witness, wasmFilePath, finalZkeyPath)
      const res: boolean = await NRLN.verifyProof(vKey, { proof: fullProof.proof, publicSignals })

      expect(res).toBe(true)
    }, 30000)
    it("Should retrieve user secret after spaming", () => {
      const identity: ZkIdentity = new ZkIdentity()

      const identitySecret: bigint[] = identity.getMultipartSecret(SPAM_TRESHOLD)

      const signal1 = "hey 1"
      const signalHash1 = genSignalHash(signal1)
      const signal2 = "hey 2"
      const signalHash2 = genSignalHash(signal2)
      const signal3 = "hey 3"
      const signalHash3 = genSignalHash(signal3)
      const signal4 = "hey 4"
      const signalHash4 = genSignalHash(signal4)

      const epoch: string = genExternalNullifier("test-epoch")
      const rlnIdentifier: bigint = NRLN.genIdentifier()

      const [y1] = NRLN.calculateOutput(identitySecret, BigInt(epoch), signalHash1, SPAM_TRESHOLD, rlnIdentifier)
      const [y2] = NRLN.calculateOutput(identitySecret, BigInt(epoch), signalHash2, SPAM_TRESHOLD, rlnIdentifier)
      const [y3] = NRLN.calculateOutput(identitySecret, BigInt(epoch), signalHash3, SPAM_TRESHOLD, rlnIdentifier)
      const [y4] = NRLN.calculateOutput(identitySecret, BigInt(epoch), signalHash4, SPAM_TRESHOLD, rlnIdentifier)

      const retrievedSecret: bigint = NRLN.retrieveSecret(
        [signalHash1, signalHash2, signalHash3, signalHash4],
        [y1, y2, y3, y4]
      )

      expect(retrievedSecret).toEqual(poseidonHash(identitySecret))
    })
  })
})
