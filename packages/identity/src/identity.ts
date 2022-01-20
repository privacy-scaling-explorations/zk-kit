import { Identity, SerializedIdentity } from "@zk-kit/types"
import { hexToBigint } from "bigint-conversion"
import { poseidon } from "circomlibjs"
import { genIdentityFromMessage, genRandomIdentity, Strategy } from "./strategies"
import { Fq, parseSerializedIdentity } from "./utils"

// The secret type is used for the identity commitment generation.
export enum SecretType {
  GENERIC, // Generic secret, composed of identityNullifier and identityTrapdoor.
  MULTIPART // Multipart secret, composed from multiple parts dependent on the spam threshold.
}

/**
 * ZkIdentity is a class which can be used by protocols supported by the
 * @zk-key/protocols package and it simplifies the management of
 * identity-related witness parameters.
 */
export default class ZkIdentity {
  private _identityTrapdoor: bigint
  private _identityNullifier: bigint

  private _secret: bigint[] = []
  private _multipartSecret: bigint[] = []
  private _defaultMultipartSecret: bigint[] = []

  /**
   * Initializes the class attributes based on the strategy passed as parameter.
   * @param strategy The strategy for identity generation.
   * @param metadata Additional data needed to create identity for given strategy.
   */
  constructor(strategy: Strategy = Strategy.RANDOM, metadata?: string | SerializedIdentity) {
    switch (strategy) {
      case Strategy.RANDOM: {
        const { identityTrapdoor, identityNullifier } = genRandomIdentity()

        this._identityTrapdoor = identityTrapdoor
        this._identityNullifier = identityNullifier
        this._secret = [this._identityNullifier, this._identityTrapdoor]
        this._setMultipartSecret()

        break
      }
      case Strategy.MESSAGE: {
        const { identityTrapdoor, identityNullifier } = genIdentityFromMessage(metadata as string)

        this._identityTrapdoor = identityTrapdoor
        this._identityNullifier = identityNullifier
        this._secret = [this._identityNullifier, this._identityTrapdoor]
        this._setMultipartSecret()

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
        this._defaultMultipartSecret = this._multipartSecret.slice(0, 2)

        break
      }
      default:
        throw new Error("Provided strategy is not supported")
    }
  }

  /**
   *  Sets the multipart secret attribute.
   */
  private _setMultipartSecret(): void {
    const initialComponent = Fq.pow(this._identityTrapdoor, this._identityNullifier)

    this._multipartSecret = [initialComponent]

    for (let i = 1; i < 16; i += 1) {
      this._multipartSecret.push(Fq.pow(initialComponent, BigInt(i + 1)))
    }

    this._defaultMultipartSecret = this._multipartSecret.slice(0, 2)
  }

  /**
   * Returns the raw user identity, composed of identityNullifier and identityTrapdoor.
   * @returns The trapdoor and nullifier values.
   */
  public getIdentity(): Identity {
    return {
      identityNullifier: this._identityNullifier,
      identityTrapdoor: this._identityTrapdoor
    }
  }

  /**
   * Returns the identity nullifier.
   * @returns The identity nullifier.
   */
  public getNullifier(): bigint {
    return this._identityNullifier
  }

  /**
   * Returns the secret.
   * @returns The secret.
   */
  public getSecret(): bigint[] {
    return this._secret
  }

  /**
   * Returns the default multipart secret or a portion of the multipart secret.
   * @param secretParts The number of the secret parts.
   * @returns The multipart secret.
   */
  public getMultipartSecret(secretParts: number = 2): bigint[] {
    return secretParts === 2 ? this._defaultMultipartSecret : this._multipartSecret.slice(0, secretParts)
  }

  /**
   * Returns the Poseidon hash of the secret.
   * @returns The hash of the secret.
   */
  public getSecretHash(): bigint {
    return poseidon(this._secret)
  }

  /**
   * Returns the Poseidon hash of the multipart secret.
   * @param secretParts The number of the secret parts.
   * @returns The hash of the multipart secret.
   */
  public getMultipartSecretHash(secretParts: number = 2): bigint {
    const multipartSecret = this.getMultipartSecret(secretParts)

    return poseidon(multipartSecret)
  }

  /**
   * Generates the identity commitment from the secret or the multipart secret.
   * @param secretType The secret type for which to generate identity commitment
   * @param secretParts The number of the secret parts.
   * @returns identity commitment
   */
  public genIdentityCommitment(secretType: SecretType = SecretType.GENERIC, secretParts: number = 2): bigint {
    switch (secretType) {
      case SecretType.GENERIC:
        return poseidon([this.getSecretHash()])
      case SecretType.MULTIPART:
        return poseidon([this.getMultipartSecretHash(secretParts)])
      default:
        throw new Error("Provided secret type is not supported")
    }
  }

  /**
   * Serializes the class attributes and returns a stringified object.
   * @returns The stringified serialized identity.
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
