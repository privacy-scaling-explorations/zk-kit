import { BigNumber } from "@ethersproject/bignumber"
import { poseidon } from "circomlibjs"
import { SerializedIdentity } from "./types"
import { genRandomNumber, sha256 } from "./utils"

// The strategy used to generate the ZK identity.
export enum Strategy {
  RANDOM, // Identity is generated randomly.
  MESSAGE, // Identity is generated from a message.
  SERIALIZED // Identity parameters are passed from outside.
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

  /**
   * Initializes the class attributes based on the strategy passed as parameter.
   * @param strategy The strategy for identity generation.
   * @param metadata Additional data needed to create identity for given strategy.
   */
  constructor(strategy: Strategy = Strategy.RANDOM, metadata?: string | SerializedIdentity) {
    switch (strategy) {
      case Strategy.RANDOM: {
        this._identityTrapdoor = genRandomNumber()
        this._identityNullifier = genRandomNumber()
        this._secret = [this._identityNullifier, this._identityTrapdoor]
        break
      }
      case Strategy.MESSAGE: {
        if (!metadata) {
          throw new Error("The message is not defined")
        }

        if (typeof metadata !== "string") {
          throw new Error("The message is not a string")
        }

        const messageHash = sha256(metadata)

        this._identityTrapdoor = BigNumber.from(`0x${sha256(`${messageHash}identity_trapdoor`)}`).toBigInt()
        this._identityNullifier = BigNumber.from(`0x${sha256(`${messageHash}identity_nullifier`)}`).toBigInt()
        this._secret = [this._identityNullifier, this._identityTrapdoor]
        break
      }
      case Strategy.SERIALIZED: {
        if (!metadata) {
          throw new Error("The serialized identity is not defined")
        }

        if (typeof metadata === "string") {
          try {
            metadata = JSON.parse(metadata) as SerializedIdentity
          } catch (error) {
            throw new Error("The serialized identity cannot be parsed")
          }
        }

        if (!("identityNullifier" in metadata) || !("identityTrapdoor" in metadata) || !("secret" in metadata)) {
          throw new Error("The serialized identity does not contain the right parameter")
        }

        const { identityNullifier, identityTrapdoor, secret } = metadata

        this._identityNullifier = BigNumber.from(`0x${identityNullifier}`).toBigInt()
        this._identityTrapdoor = BigNumber.from(`0x${identityTrapdoor}`).toBigInt()
        this._secret = secret.map((item) => BigNumber.from(`0x${item}`).toBigInt())

        break
      }
      default:
        throw new Error("The provided strategy is not supported")
    }
  }

  /**
   * Returns the identity trapdoor.
   * @returns The identity trapdoor.
   */
  public getTrapdoor(): bigint {
    return this._identityTrapdoor
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
   * Returns the Poseidon hash of the secret.
   * @returns The hash of the secret.
   */
  public getSecretHash(): bigint {
    return poseidon(this._secret)
  }

  /**
   * Generates the identity commitment from the secret.
   * @returns identity commitment
   */
  public genIdentityCommitment(): bigint {
    return poseidon([this.getSecretHash()])
  }

  /**
   * Serializes the class attributes and returns a stringified object.
   * @returns The stringified serialized identity.
   */
  public serializeIdentity(): string {
    const data: SerializedIdentity = {
      identityNullifier: this._identityNullifier.toString(16),
      identityTrapdoor: this._identityTrapdoor.toString(16),
      secret: this._secret.map((item) => item.toString(16))
    }

    return JSON.stringify(data)
  }
}
