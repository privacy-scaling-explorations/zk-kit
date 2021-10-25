import { Strategy, ZkIdentity } from "../src"

describe("Semaphore identity", () => {
  describe("Create identity", () => {
    it("Should create a Semaphore identity", async () => {
      const identity: ZkIdentity = new ZkIdentity()

      expect(typeof identity).toEqual("object")
    })

    it("Should create a Semaphore identity with a message strategy", async () => {
      const identity: ZkIdentity = new ZkIdentity(Strategy.MESSAGE, "message")

      expect(typeof identity).toEqual("object")
    })

    it("Should generate secret from identity", async () => {
      const identity: ZkIdentity = new ZkIdentity()
      identity.genSecretFromIdentity()
      const identitySecret = identity.getSecret()

      expect(identitySecret.length).toEqual(2)
      expect(typeof identitySecret).toEqual("object")
    })

    it("Should generate random secret", async () => {
      const secretParts = 5
      const identity: ZkIdentity = new ZkIdentity()
      identity.genRandomSecret(secretParts)
      const identitySecret = identity.getSecret()

      expect(identitySecret.length).toEqual(5)
      expect(typeof identitySecret).toEqual("object")
    })

    it("Should generate identity commitment from identity", async () => {
      const identity: ZkIdentity = new ZkIdentity()
      const identityCommitment: bigint = identity.genIdentityCommitment()

      expect(typeof identityCommitment).toEqual("bigint")
    })

    it("Should generate identity commitment from random secret", async () => {
      const secretParts = 5
      const identity: ZkIdentity = new ZkIdentity()
      identity.genRandomSecret(secretParts)
      const identityCommitment: bigint = identity.genIdentityCommitmentFromSecret()

      expect(typeof identityCommitment).toEqual("bigint")
    })

    it("Should serialize identity", async () => {
      const identity: ZkIdentity = new ZkIdentity()
      const serialized: string = identity.serializeIdentity()

      expect(typeof serialized).toEqual("string")
    })

    it("Should unserialize identity", async () => {
      const identity: ZkIdentity = new ZkIdentity()
      const serialized: string = identity.serializeIdentity()
      const unserialized: ZkIdentity = ZkIdentity.genFromSerialized(serialized)

      expect(unserialized).toStrictEqual(identity)
    })
  })
})
