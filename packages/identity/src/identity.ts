import { genRandomIdentity, genIdentityFromSignedMessage, genRandomNumber } from "./strategies"
import * as bigintConversion from "bigint-conversion"
import * as ciromlibjs from "circomlibjs"
import { Identity } from "@libsem/types"

const poseidonHash = (data: Array<bigint>): bigint => {
  return ciromlibjs.poseidon(data)
}

enum Strategy {
  RANDOM,
  SIGNED_MESSAGE,
  SERIALIZED
}

class ZkIdentity {
  private identityTrapdoor: bigint;
  private identityNullifier: bigint;
  private secret: Array<bigint> = [];
  /**
   * Generates new ZkIdentity
   * @param strategy strategy for identity generation
   * @param metadata additional data needed to create identity for given strategy
   * @returns
   */
  constructor(strategy: Strategy = Strategy.RANDOM, metadata: any = {}) {
    if (strategy === Strategy.RANDOM) {
      const { identityTrapdoor, identityNullifier } = genRandomIdentity();
      this.identityTrapdoor = identityTrapdoor;
      this.identityNullifier = identityNullifier;
    } else if (strategy === Strategy.SIGNED_MESSAGE) {
      const { identityTrapdoor, identityNullifier } = genIdentityFromSignedMessage(metadata);
      this.identityTrapdoor = identityTrapdoor;
      this.identityNullifier = identityNullifier;
    } else if (strategy === Strategy.SERIALIZED) {
      const { identityTrapdoor, identityNullifier } = metadata;
      this.identityNullifier = identityNullifier;
      this.identityTrapdoor = identityTrapdoor;
    } else throw new Error("provided strategy is not supported")
  }

  /**
   * Unserializes identity
   * @param serialisedIdentity
   * @returns
   */
  static genFromSerialized(serialisedIdentity: string): ZkIdentity {
    const data = JSON.parse(serialisedIdentity);
    if(data.length !== 2) throw new Error('Format is wrong');
    return new ZkIdentity(Strategy.SERIALIZED, {
      identityNullifier: bigintConversion.hexToBigint(data[0]),
      identityTrapdoor: bigintConversion.hexToBigint(data[1])
    });
  }
  /**
   *
   * @returns Identity
   */
  getIdentity(): Identity {
    return {
      identityNullifier: this.identityNullifier,
      identityTrapdoor: this.identityTrapdoor,
    }
  }

  getNullifier(): bigint {
    return this.identityNullifier;
  }

  getSecret(): Array<bigint> {
    return this.secret;
  }

  /**
   * Creates secret from ZkIdentity
   * @returns
   */
  genSecretFromIdentity() {
    this.secret = [this.identityNullifier, this.identityTrapdoor]
  }

  /**
   * Creates random secret
   * @param parts number of parts in secret
   * @returns secret
   */
  genRandomSecret(parts = 2) {
    this.secret = [];
    for (let i = 0; i < parts; i++) {
      this.secret.push(genRandomNumber())
    }
  }

  /**
   * Generate commitment from identity secret
   * @returns identity commitment
   */
  genIdentityCommitmentFromSecret(): bigint {
    if(!this.secret.length) throw new Error('Secret is not generated');
    const secretHash = poseidonHash(this.secret);
    return poseidonHash([secretHash]);
  }

  /**
   * Generate commitment from identity
   * @returns identity commitment
   */
  genIdentityCommitment(): bigint {
    const secretHash = poseidonHash([this.identityNullifier, this.identityTrapdoor])
    return poseidonHash([secretHash])
  }

  /**
   * Serializes identity
   * @param identity to serialize
   * @returns serialized identity
   */
  serializeIdentity(): string {
    const data = [this.identityNullifier.toString(16), this.identityTrapdoor.toString(16)]
    return JSON.stringify(data)
  }
}

export default ZkIdentity;
