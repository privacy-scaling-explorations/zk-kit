import { genRandomIdentity, genIdentityFromSignedMessage, genRandomNumber } from "./strategies";
import * as bigintConversion from "bigint-conversion";
import * as ciromlibjs from "circomlibjs";
import { Identity } from "@libsem/types";

const poseidonHash = (data: Array<bigint>): bigint => {
  return ciromlibjs.poseidon(data);
};

class ZkIdentity {
  /**
   * Generates new ZkIdentity
   * @param strategy strategy for identity generation
   * @param metadata additional data needed to create identity for given strategy
   * @returns Identity
   */
  genIdentity(strategy: "random" | "signedMessage" = "random", metadata: any = {}): Identity {
    if (strategy === "random") return genRandomIdentity();
    else if (strategy === "signedMessage") return genIdentityFromSignedMessage(metadata);

    throw new Error("provided strategy is not supported");
  }

  /**
   * Creates secret from ZkIdentity
   * @param identity identity to generate secret for
   * @returns secret
   */
  genSecretFromIdentity(identity: Identity): bigint[] {
    return [identity.identityNullifier, identity.identityTrapdoor];
  }

  /**
   * Creates random secret
   * @param parts number of parts in secret
   * @returns secret
   */
  genRandomSecret(parts = 2): bigint[] {
    const secret: bigint[] = [];
    for (let i = 0; i < parts; i++) {
      secret.push(genRandomNumber());
    }
    return secret;
  }

  /**
   * Generate commitment from identity secret
   * @param secret identity secret
   * @returns identity commitment
   */
  genIdentityCommitmentFromSecret(secret: bigint[]): bigint {
    const secretHash = poseidonHash(secret);
    return poseidonHash([secretHash]);
  }

  /**
   * Generate commitment from identity
   * @param identity identity
   * @returns identity commitment
   */
  genIdentityCommitment(identity: Identity): bigint {
    const secretHash = poseidonHash([identity.identityNullifier, identity.identityTrapdoor]);
    return poseidonHash([secretHash]);
  }

  /**
   * Serializes identity
   * @param identity to serialize
   * @returns serialized identity
   */
  serializeIdentity(identity: Identity): string {
    const data = [identity.identityNullifier.toString(16), identity.identityTrapdoor.toString(16)];
    return JSON.stringify(data);
  }

  /**
   * Unserializes identity
   * @param serialisedIdentity
   * @returns ZkIdentity
   */
  unSerializeIdentity(serialisedIdentity: string): Identity {
    const data = JSON.parse(serialisedIdentity);
    return {
      identityNullifier: bigintConversion.hexToBigint(data[0]),
      identityTrapdoor: bigintConversion.hexToBigint(data[1]),
    };
  }
}

export default new ZkIdentity();
