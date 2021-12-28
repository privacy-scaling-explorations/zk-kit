import { NRln } from "../src"
import { ZkIdentity } from "../../identity/src"
import { MerkleProof, FullProof } from "../../types"
import { genSignalHash, genExternalNullifier, generateMerkleProof, poseidonHash } from "../src/utils"
import * as path from "path"
import * as fs from "fs"

const identityCommitments: Array<bigint> = []
const SPAM_TRESHOLD = 3;

beforeAll(() => {
  const leafIndex = 3

  for (let i = 0; i < leafIndex; i++) {
    const tmpIdentity = new ZkIdentity();
    tmpIdentity.genSecret(SPAM_TRESHOLD);
    const tmpCommitment: bigint = tmpIdentity.genIdentityCommitment();
    identityCommitments.push(tmpCommitment)
  }
})

describe("NRln", () => {
  describe("NRln functionalities", () => {
    it("Generate nrln witness", () => {
      const identity: ZkIdentity = new ZkIdentity();
      identity.genSecret(SPAM_TRESHOLD);
      
      const identityCommitment: bigint = identity.genIdentityCommitment();
      const identitySecret: bigint[] = identity.getSecret();

      const commitments: Array<bigint> = Object.assign([], identityCommitments)
      commitments.push(identityCommitment)

      const signal = "hey hey"
      const epoch: string = genExternalNullifier("test-epoch")
      const rlnIdentifier: bigint = NRln.genIdentifier()

      const merkleProof: MerkleProof = generateMerkleProof(15, BigInt(0), 2, commitments, identityCommitment)
      const witness: FullProof = NRln.genWitness(identitySecret, merkleProof, epoch, signal, rlnIdentifier)

      expect(typeof witness).toBe("object")
    })
    it.skip("Generate nrln proof and verify it", async () => {
      /**
       * Compiled NRln circuits are needed to run this test so it's being skipped in hooks
       */
       const identity: ZkIdentity = new ZkIdentity();
       identity.genSecret(SPAM_TRESHOLD);
       
       const identityCommitment: bigint = identity.genIdentityCommitment();
       const identitySecret: bigint[] = identity.getSecret();

      const commitments: Array<bigint> = Object.assign([], identityCommitments)
      commitments.push(identityCommitment)

      const signal = "hey hey"
      const signalHash = genSignalHash(signal)
      const epoch: string = genExternalNullifier("test-epoch")
      const rlnIdentifier: bigint = NRln.genIdentifier()

      const merkleProof: MerkleProof = generateMerkleProof(15, BigInt(0), 2, commitments, identityCommitment)
      const witness: FullProof = NRln.genWitness(identitySecret, merkleProof, epoch, signal, rlnIdentifier)

      const [y, nullifier] = NRln.calculateOutput(identitySecret, BigInt(epoch), signalHash, SPAM_TRESHOLD, rlnIdentifier)
      const publicSignals = [y, merkleProof.root, nullifier, signalHash, epoch, rlnIdentifier]

      const vkeyPath: string = path.join("./zkeyFiles", "nrln", "verification_key.json")
      const vKey = JSON.parse(fs.readFileSync(vkeyPath, "utf-8"))

      const wasmFilePath: string = path.join("./zkeyFiles", "nrln", "rln.wasm")
      const finalZkeyPath: string = path.join("./zkeyFiles", "nrln", "rln_final.zkey")

      const fullProof: FullProof = await NRln.genProof(witness, wasmFilePath, finalZkeyPath)
      const res: boolean = await NRln.verifyProof(vKey, { proof: fullProof.proof, publicSignals })

      expect(res).toBe(true)
    }, 30000)
    it("Should retrieve user secret after spaming", () => {
        const identity: ZkIdentity = new ZkIdentity();
        identity.genSecret(SPAM_TRESHOLD);
        
        const identitySecret: bigint[] = identity.getSecret();

        const signal1 = "hey 1"
        const signalHash1 = genSignalHash(signal1)
        const signal2 = "hey 2"
        const signalHash2 = genSignalHash(signal2)
        const signal3 = "hey 3"
        const signalHash3 = genSignalHash(signal3)
        const signal4 = "hey 4"
        const signalHash4 = genSignalHash(signal4)

        const epoch: string = genExternalNullifier("test-epoch")
        const rlnIdentifier: bigint = NRln.genIdentifier()

        const [y1] = NRln.calculateOutput(identitySecret, BigInt(epoch), signalHash1, SPAM_TRESHOLD, rlnIdentifier)
        const [y2] = NRln.calculateOutput(identitySecret, BigInt(epoch), signalHash2, SPAM_TRESHOLD, rlnIdentifier)
        const [y3] = NRln.calculateOutput(identitySecret, BigInt(epoch), signalHash3, SPAM_TRESHOLD, rlnIdentifier)
        const [y4] = NRln.calculateOutput(identitySecret, BigInt(epoch), signalHash4, SPAM_TRESHOLD, rlnIdentifier)

        const retrievedSecret: bigint = NRln.retrieveSecret([signalHash1, signalHash2, signalHash3, signalHash4], [y1, y2, y3, y4])

        expect(retrievedSecret).toEqual(poseidonHash(identitySecret));
    })
  })
})
