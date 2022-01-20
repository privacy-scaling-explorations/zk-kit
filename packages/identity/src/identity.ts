import { Identity, SerializedIdentity } from "@zk-kit/types"
import { hexToBigint } from "bigint-conversion"
import { poseidon } from "circomlibjs"
import { genIdentityFromMessage, genRandomIdentity, Strategy } from "./strategies"
import { Fq, parseSerializedIdentity } from "./utils"

export enum SecretType {
  GENERIC, // Generic secret, composed of identityNullifier and identityTrapdoor.
  MULTIPART_SECRET // Multipart secret, composed from multiple parts dependent on the spam threshold.
}

export default class ZkIdentity {
  private _identityTrapdoor: bigint
  private _identityNullifier: bigint

  private _secret: bigint[] = []
  private _multipartSecret: bigint[] = []

  /**
   * Generates new ZkIdentity.
   * @param strategy strategy for identity generation.
   * @param metadata additional data needed to create identity for given strategy.
   * @returns
   */
  constructor(strategy: Strategy = Strategy.RANDOM, metadata?: string | SerializedIdentity) {
    switch (strategy) {
      case Strategy.RANDOM: {
        const { identityTrapdoor, identityNullifier } = genRandomIdentity()

        this._identityTrapdoor = identityTrapdoor
        this._identityNullifier = identityNullifier
        this._secret = [this._identityNullifier, this._identityTrapdoor]
        this.genMultipartSecret()

        break
      }
      case Strategy.MESSAGE: {
        const { identityTrapdoor, identityNullifier } = genIdentityFromMessage(metadata as string)

        this._identityTrapdoor = identityTrapdoor
        this._identityNullifier = identityNullifier
        this._secret = [this._identityNullifier, this._identityTrapdoor]
        this.genMultipartSecret()

        break
      }
      case Strategy.SERIALIZED: {
        if (!metadata) {
          throw new Error("Metadata is not defined")
        }

        if (typeof metadata === "string") {
          metadata = parseSerializedIdentity(metadata)
        }

        const { identityNullifier, identityTrapdoor, secret, multipartSecret } = metadata

        this._identityNullifier = hexToBigint(identityNullifier)
        this._identityTrapdoor = hexToBigint(identityTrapdoor)
        this._secret = secret.map((item) => hexToBigint(item))
        this._multipartSecret = multipartSecret.map((item) => hexToBigint(item))

        break
      }
      default:
        throw new Error("Provided strategy is not supported")
    }
  }

  /**
   * Generate multipart secret. To be used by RLN related apps.
   * @param parts The number of parts that the secret should be composed of,
   * corresponding to the spam threshold of the protocol
   */
  public genMultipartSecret(parts = 2): void {
    if (parts < 2) throw new Error("Invalid number of parts")

    const initialComponent = Fq.pow(this._identityTrapdoor, this._identityNullifier)

    this._multipartSecret = [initialComponent]

    for (let i = 1; i < parts; i += 1) {
      this._multipartSecret.push(Fq.pow(initialComponent, BigInt(i + 1)))
    }
  }

  /**
   * Return the raw user identity, composed of identityNullifier and identityTrapdoor.
   * @returns Identity
   */
  public getIdentity(): Identity {
    return {
      identityNullifier: this._identityNullifier,
      identityTrapdoor: this._identityTrapdoor
    }
  }

  public getNullifier(): bigint {
    return this._identityNullifier
  }

  public getSecret(): bigint[] {
    return this._secret
  }

  public getMultipartSecret(): bigint[] {
    return this._multipartSecret
  }

  public getSecretHash(): bigint {
    return poseidon(this._secret)
  }

  public getMultipartSecretHash(): bigint {
    return poseidon(this._multipartSecret)
  }

  /**
   * Generate commitment from secret
   * @param secretType The secret type for which to generate identity commitment
   * @returns identity commitment
   */
  public genIdentityCommitment(secretType: SecretType = SecretType.GENERIC): bigint {
    switch (secretType) {
      case SecretType.GENERIC:
        return poseidon([this.getSecretHash()])
      case SecretType.MULTIPART_SECRET:
        return poseidon([this.getMultipartSecretHash()])
      default:
        throw new Error("Provided secret type is not supported")
    }
  }

  /**
   * Serializes the `identityNullifier`, `identityTrapdoor` and `secret` from the identity
   * @returns stringified serialized identity
   */
  public serializeIdentity(): string {
    const data: SerializedIdentity = {
      identityNullifier: this._identityNullifier.toString(16),
      identityTrapdoor: this._identityTrapdoor.toString(16),
      secret: this._secret.map((item) => item.toString(16)),
      multipartSecret: this._multipartSecret.map((item) => item.toString(16))
    }

    return JSON.stringify(data)
  }
}
