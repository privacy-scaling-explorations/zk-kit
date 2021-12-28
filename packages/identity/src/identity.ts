import { genRandomIdentity, genIdentityFromMessage, genRandomNumber } from "./strategies"
import * as bigintConversion from "bigint-conversion"
import * as ciromlibjs from "circomlibjs"
import { Identity, SerializedIdentity } from "@libsem/types"
import {Fq} from "./utils"

const poseidonHash = (data: Array<bigint>): bigint => {
  return ciromlibjs.poseidon(data)
}

export enum Strategy {
  RANDOM,
  MESSAGE,
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
  constructor(strategy: Strategy = Strategy.RANDOM, metadata?: string | SerializedIdentity) {
    if (strategy === Strategy.RANDOM) {
      const { identityTrapdoor, identityNullifier } = genRandomIdentity()
      this.identityTrapdoor = identityTrapdoor
      this.identityNullifier = identityNullifier
      this.genSecret()
    } else if (strategy === Strategy.MESSAGE) {
      const { identityTrapdoor, identityNullifier } = genIdentityFromMessage(metadata as string)
      this.identityTrapdoor = identityTrapdoor
      this.identityNullifier = identityNullifier
      this.genSecret()
    } else if (strategy === Strategy.SERIALIZED) {
      const { identityNullifier, identityTrapdoor, secret } = metadata as SerializedIdentity
      this.identityNullifier = bigintConversion.hexToBigint(identityNullifier)
      this.identityTrapdoor = bigintConversion.hexToBigint(identityTrapdoor)
      this.secret = secret.map(item => bigintConversion.hexToBigint(item));

    } else throw new Error("provided strategy is not supported")
  }


  /**
   * Unserialize serialized identity
   * @param serialisedIdentity
   * @returns
   */
  static genFromSerialized(serialisedIdentity: string): ZkIdentity {
    const data = JSON.parse(serialisedIdentity)
    if(!('identityNullifier' in data) || !('identityTrapdoor' in data) || !('secret' in data)) throw new Error("Wrong input identity");
    return new ZkIdentity(Strategy.SERIALIZED, {
      identityNullifier: data['identityNullifier'],
      identityTrapdoor: data['identityTrapdoor'],
      secret: data['secret']
    })
  }
  /**
   *
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


  getSecretHash(): bigint {
    return poseidonHash(this.secret)
  }


  /**
   * Creates secret from ZkIdentity
   * @returns
   */
  genSecret(parts = 2): void {
    if(parts < 2) throw new Error("Invalid number of parts");
    if(parts === 2) {
      this.secret = [this.identityNullifier, this.identityTrapdoor]
    } else {
      const initialComponent = Fq.pow(this.identityTrapdoor, this.identityNullifier);
      this.secret = [initialComponent]
      for(let i = 1; i < parts; i++) {
        this.secret.push(Fq.pow(initialComponent, BigInt(i + 1)))
      }
    }
  }

  /**
   * Generate commitment from identity
   * @returns identity commitment
   */
  genIdentityCommitment(): bigint {
    const secretHash = this.getSecretHash();
    return poseidonHash([secretHash])
  }

  /**
   * Serializes the `identityNullifier`, `identityTrapdoor` and `secret` from the identity
   * @returns stringified serialized identity
   */
   serializeIdentity(): string {
    const data: SerializedIdentity = {
      identityNullifier: this.identityNullifier.toString(16),
      identityTrapdoor: this.identityTrapdoor.toString(16),
      secret: this.secret.map(item => item.toString(16))
    }
    return JSON.stringify(data);
  }
}

export default ZkIdentity
