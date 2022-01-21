import { SecretType, Strategy, ZkIdentity } from "../src"

describe("ZK identity", () => {
  describe("Create identity", () => {
    it("Should not create a ZK identity if the strategy is wrong", () => {
      const fun = () => new ZkIdentity("wrong" as any)

      expect(fun).toThrow("strategy is not supported")
    })

    it("Should create a ZK identity", () => {
      const identity = new ZkIdentity()

      expect(typeof identity).toBe("object")
    })

    it("Should not create a ZK identity with a message strategy if there is no message", () => {
      const fun = () => new ZkIdentity(Strategy.MESSAGE)

      expect(fun).toThrow("The message is not defined")
    })

    it("Should not create a ZK identity with a message strategy if the message is not a string", () => {
      const fun = () => new ZkIdentity(Strategy.MESSAGE, 1 as any)

      expect(fun).toThrow("The message is not a string")
    })

    it("Should create a ZK identity with a message strategy", () => {
      const identity = new ZkIdentity(Strategy.MESSAGE, "message")

      const trapdoor = identity.getTrapdoor()
      const nullifier = identity.getNullifier()
      const identitySecret = identity.getSecret()
      const identityMultipartSecret = identity.getMultipartSecret(5)

      expect(typeof identity).toBe("object")
      expect(trapdoor).toBe(BigInt("58952291509798197436757858062402199043831251943841934828591473955215726495831"))
      expect(nullifier).toBe(BigInt("44673097405870585416457571638073245190425597599743560105244308998175651589997"))
      expect(identitySecret).toHaveLength(2)
      expect(typeof identitySecret).toBe("object")
      expect(identityMultipartSecret).toHaveLength(5)
      expect(typeof identityMultipartSecret).toBe("object")
    })

    it("Should get the multipart secret hash", () => {
      const identity = new ZkIdentity(Strategy.MESSAGE, "message")

      const multipartSecretHash = identity.getMultipartSecretHash(2)

      expect(multipartSecretHash).toBe(
        BigInt("6297169125057226632028063090073601040720936421655236852498563322517193066452")
      )
    })

    it("Should not generate identity commitment if the secret type is wrong", () => {
      const identity = new ZkIdentity()
      const fun = () => identity.genIdentityCommitment("wrong" as any)

      expect(fun).toThrow("secret type is not supported")
    })

    it("Should generate an identity commitment from a generic secret", () => {
      const identity = new ZkIdentity(Strategy.MESSAGE, "message")
      const identityCommitment = identity.genIdentityCommitment()

      expect(identityCommitment).toBe(
        BigInt("1720349790382552497189398984241859233944354304766757200361065203741879866188")
      )
    })

    it("Should generate an identity commitment from a multipart secret", () => {
      const identity = new ZkIdentity(Strategy.MESSAGE, "message")
      const identityCommitment = identity.genIdentityCommitment(SecretType.MULTIPART)

      expect(identityCommitment).toBe(
        BigInt("2814782719841798642796697732526373861365963990553246162063123378852339665110")
      )
    })

    it("Should serialize an identity", () => {
      const identity = new ZkIdentity()
      const serialized = identity.serializeIdentity()

      expect(typeof serialized).toBe("string")
    })

    it("Should not create a ZK identity with a serialized strategy if there is no serialize identity", () => {
      const fun = () => new ZkIdentity(Strategy.SERIALIZED)

      expect(fun).toThrow("serialized identity is not defined")
    })

    it("Should not create a ZK identity with a serialized strategy if the serialize identity cannot be parsed", () => {
      const fun = () => new ZkIdentity(Strategy.SERIALIZED, "{a}")

      expect(fun).toThrow("The serialized identity cannot be parsed")
    })

    it("Should not create a ZK identity with a serialized strategy if the serialize identity does not contain the right parameters", () => {
      const fun = () =>
        new ZkIdentity(Strategy.SERIALIZED, {
          identityTrapdoor: "234"
        } as any)

      expect(fun).toThrow("The serialized identity does not contain the right parameter")
    })

    it("Should create a ZK identity with a serialized strategy", () => {
      const identity1 = new ZkIdentity()
      const serialized = identity1.serializeIdentity()
      const identity2 = new ZkIdentity(Strategy.SERIALIZED, serialized)

      expect(identity2).toStrictEqual(identity1)
    })
  })
})
