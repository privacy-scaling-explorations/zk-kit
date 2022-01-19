import { Identity, SerializedIdentity } from "@zk-kit/types"
import * as bigintConversion from "bigint-conversion"
import * as ciromlibjs from "circomlibjs"
import { genIdentityFromMessage, genRandomIdentity } from "./strategies"
import { Fq } from "./utils"

const poseidonHash = (data: Array<bigint>): bigint => ciromlibjs.poseidon(data)

export enum Strategy {
  RANDOM,
  MESSAGE,
  SERIALIZED
}

export enum SecretType {
  GENERIC, // generic secret, composed of identityNullifier and identityTrapdoor
  MULTIPART_SECRET // multipart secret, composed from multiple parts dependent on the spam threshold
}

class ZkIdentity {
  private identityTrapdoor: bigint
  private identityNullifier: bigint
  private secret: Array<bigint> = []
  private multipartSecret: Array<bigint> = []
  /**
   * Generates new ZkIdentity
   * @param strategy strategy for identity generation
   * @param metadata additional data needed to create identity for given strategy
   * @returns
   */
  constructor(strategy: Strategy = Strategy.RANDOM, metadata?: string | SerializedIdentity) {
    if (strategy === Strategy.RANDOM) {
      const { identityTrapdoor, identityNullifier } = genRandomIdentity()
      this.identityTrapdoor = identityTrapdoor
      this.identityNullifier = identityNullifier
      this.genSecret()
      this.genMultipartSecret()
    } else if (strategy === Strategy.MESSAGE) {
      const { identityTrapdoor, identityNullifier } = genIdentityFromMessage(metadata as string)
      this.identityTrapdoor = identityTrapdoor
      this.identityNullifier = identityNullifier
      this.genSecret()
      this.genMultipartSecret()
    } else if (strategy === Strategy.SERIALIZED) {
      const { identityNullifier, identityTrapdoor, secret, multipartSecret } = metadata as SerializedIdentity
      this.identityNullifier = bigintConversion.hexToBigint(identityNullifier)
      this.identityTrapdoor = bigintConversion.hexToBigint(identityTrapdoor)
      this.secret = secret.map((item) => bigintConversion.hexToBigint(item))
      this.multipartSecret = multipartSecret.map((item) => bigintConversion.hexToBigint(item))
    } else throw new Error("provided strategy is not supported")
  }

  // Secret and identity generation

  /**
   * Generate generic secret. To be used by Semaphore related apps.
   */
  genSecret(): void {
    this.secret = [this.identityNullifier, this.identityTrapdoor]
  }

  /**
   * Generate multipart secret. To be used by RLN related apps.
   * @param parts The number of parts that the secret should be composed of,
   * corresponding to the spam threshold of the protocol
   */
  genMultipartSecret(parts = 2): void {
    if (parts < 2) throw new Error("Invalid number of parts")

    const initialComponent = Fq.pow(this.identityTrapdoor, this.identityNullifier)
    this.multipartSecret = [initialComponent]
    for (let i = 1; i < parts; i += 1) {
      this.multipartSecret.push(Fq.pow(initialComponent, BigInt(i + 1)))
    }
  }

  /**
   * Generate commitment from secret
   * @param secretType The secret type for which to generate identity commitment
   * @returns identity commitment
   */
  genIdentityCommitment(secretType: SecretType = SecretType.GENERIC): bigint {
    let secretHash = this.getSecretHash()
    if (secretType === SecretType.MULTIPART_SECRET) {
      secretHash = this.getMultipartSecretHash()
    }
    return poseidonHash([secretHash])
  }

  // Serialization

  /**
   * Serializes the `identityNullifier`, `identityTrapdoor` and `secret` from the identity
   * @returns stringified serialized identity
   */
  serializeIdentity(): string {
    const data: SerializedIdentity = {
      identityNullifier: this.identityNullifier.toString(16),
      identityTrapdoor: this.identityTrapdoor.toString(16),
      secret: this.secret.map((item) => item.toString(16)),
      multipartSecret: this.multipartSecret.map((item) => item.toString(16))
    }
    return JSON.stringify(data)
  }

  /**
   * Unserialize serialized identity
   * @param serialisedIdentity
   * @returns
   */
  static genFromSerialized(serialisedIdentity: string): ZkIdentity {
    const data = JSON.parse(serialisedIdentity)
    if (
      !("identityNullifier" in data) ||
      !("identityTrapdoor" in data) ||
      !("secret" in data) ||
      !("multipartSecret" in data)
    )
      throw new Error("Wrong input identity")
    return new ZkIdentity(Strategy.SERIALIZED, {
      identityNullifier: data.identityNullifier,
      identityTrapdoor: data.identityTrapdoor,
      secret: data.secret,
      multipartSecret: data.multipartSecret
    })
  }

  // Getters

  /**
   * Return the raw user identity, composed of identityNullifier and identityTrapdoor.
   * @returns Identity
   */
  getIdentity(): Identity {
    return {
      identityNullifier: this.identityNullifier,
      identityTrapdoor: this.identityTrapdoor
    }
  }

  getNullifier(): bigint {
    return this.identityNullifier
  }

  getSecret(): Array<bigint> {
    return this.secret
  }

  getMultipartSecret(): Array<bigint> {
    return this.multipartSecret
  }

  getSecretHash(): bigint {
    return poseidonHash(this.secret)
  }

  getMultipartSecretHash(): bigint {
    return poseidonHash(this.multipartSecret)
  }
}

export default ZkIdentity
