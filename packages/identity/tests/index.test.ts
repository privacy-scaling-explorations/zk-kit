import { Strategy, ZkIdentity } from "../src"

describe("ZK identity", () => {
  describe("Create identity", () => {
    it("Should not create a ZK identity if the strategy is wrong", () => {
      const fun = () => new ZkIdentity("wrong" as any)

      expect(fun).toThrow("strategy is not supported")
    })

    it("Should create a ZK identity", () => {
      const identity = new ZkIdentity()

      const identitySecret = identity.getSecret()
      const identityMultipartSecret = identity.getMultipartSecret()

      expect(identitySecret).toHaveLength(2)
      expect(typeof identitySecret).toBe("object")
      expect(identityMultipartSecret).toHaveLength(2)
      expect(typeof identityMultipartSecret).toBe("object")
      expect(typeof identity).toBe("object")
    })

    it("Should create a ZK identity with a message strategy", () => {
      const identity = new ZkIdentity(Strategy.MESSAGE, "message")

      expect(typeof identity).toBe("object")
    })

    it("Should not generate identity commitment if the secret type is wrong", () => {
      const identity = new ZkIdentity()
      const fun = () => identity.genIdentityCommitment("wrong" as any)

      expect(fun).toThrow("secret type is not supported")
    })

    it("Should generate identity commitment", () => {
      const identity = new ZkIdentity()
      const identityCommitment = identity.genIdentityCommitment()

      expect(typeof identityCommitment).toBe("bigint")
    })

    it("Should serialize an identity", () => {
      const identity = new ZkIdentity()
      const serialized = identity.serializeIdentity()

      expect(typeof serialized).toBe("string")
    })

    it("Should unserialize an identity", () => {
      const identity1 = new ZkIdentity()
      const serialized = identity1.serializeIdentity()
      const identity2 = new ZkIdentity(Strategy.SERIALIZED, serialized)

      expect(identity2).toStrictEqual(identity1)
    })
  })
})
