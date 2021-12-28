import { RLN } from "../src"
import { ZkIdentity, SecretType } from "../../identity/src"
import { MerkleProof, FullProof } from "../../types"
import { genSignalHash, genExternalNullifier, generateMerkleProof } from "../src/utils"
import * as path from "path"
import * as fs from "fs"

const identityCommitments: Array<bigint> = []

beforeAll(() => {
  const leafIndex = 3

  for (let i = 0; i < leafIndex; i++) {
    const tmpIdentity = new ZkIdentity();
    const tmpCommitment: bigint = tmpIdentity.genIdentityCommitment(SecretType.MULTIPART_SECRET);
    identityCommitments.push(tmpCommitment)
  }
})

describe("RLN with default spam threshold", () => {
  describe("RLN functionalities", () => {
    it("Generate RLN witness", () => {
      const identity: ZkIdentity = new ZkIdentity();
      const identityCommitment: bigint = identity.genIdentityCommitment(SecretType.MULTIPART_SECRET);
      const secret: bigint[] = identity.getMultipartSecret();

      const commitments: Array<bigint> = Object.assign([], identityCommitments)
      commitments.push(identityCommitment)

      const signal = "hey hey"
      const epoch: string = genExternalNullifier("test-epoch")
      const rlnIdentifier: bigint = RLN.genIdentifier()

      const merkleProof: MerkleProof = generateMerkleProof(15, BigInt(0), 2, commitments, identityCommitment)
      const witness: FullProof = RLN.genWitness(secret, merkleProof, epoch, signal, rlnIdentifier)

      expect(typeof witness).toBe("object")
    })
    it.skip("Generate RLN proof and verify it", async () => {
      /**
       * Compiled RLN circuits are needed to run this test so it's being skipped in hooks
       */
      const identity: ZkIdentity = new ZkIdentity();
      identity.genMultipartSecret(2);
      const secret: bigint[] = identity.getMultipartSecret();
      console.log("multipart secret", secret);
      const identityCommitment: bigint = identity.genIdentityCommitment(SecretType.MULTIPART_SECRET);

      const commitments: Array<bigint> = Object.assign([], identityCommitments)
      commitments.push(identityCommitment)

      const signal = "hey hey"
      const signalHash = genSignalHash(signal)
      const epoch: string = genExternalNullifier("test-epoch")
      const rlnIdentifier: bigint = RLN.genIdentifier()

      const merkleProof: MerkleProof = generateMerkleProof(15, BigInt(0), 2, commitments, identityCommitment)
      const witness: FullProof = RLN.genWitness(secret, merkleProof, epoch, signal, rlnIdentifier)

      const [y, nullifier] = RLN.calculateOutput(secret, BigInt(epoch), signalHash, 2, rlnIdentifier); 
      const publicSignals = [y, merkleProof.root, nullifier, signalHash, epoch, rlnIdentifier]

      const vkeyPath: string = path.join("./zkeyFiles", "rln_default", "verification_key.json")
      const vKey = JSON.parse(fs.readFileSync(vkeyPath, "utf-8"))

      const wasmFilePath: string = path.join("./zkeyFiles", "rln_default", "rln.wasm")
      const finalZkeyPath: string = path.join("./zkeyFiles", "rln_default", "rln_final.zkey")

      const fullProof: FullProof = await RLN.genProof(witness, wasmFilePath, finalZkeyPath)
      const res: boolean = await RLN.verifyProof(vKey, { proof: fullProof.proof, publicSignals })

      expect(res).toBe(true)
    }, 30000)
    // it("Should retrieve user secret after spaming", () => {
    //   const identity: ZkIdentity = new ZkIdentity();
    //   const secret: bigint[] = identity.getMultipartSecret();

    //   const signal1 = "hey hey"
    //   const signalHash1 = genSignalHash(signal1)
    //   const signal2 = "hey hey again"
    //   const signalHash2 = genSignalHash(signal2)

    //   const epoch: string = genExternalNullifier("test-epoch")
    //   const rlnIdentifier: bigint = RLN.genIdentifier()

    //   const [y1] = RLN.calculateOutput(secret, BigInt(epoch), signalHash1, 2, rlnIdentifier )
    //   const [y2] = RLN.calculateOutput(secret, BigInt(epoch), signalHash2, 2, rlnIdentifier)

    //   const retrievedSecret: bigint = RLN.retrieveSecret([signalHash1, signalHash2], [y1, y2])

    //   expect(retrievedSecret).toEqual(secret)
    // })
  })
})
