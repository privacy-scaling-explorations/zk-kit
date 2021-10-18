import { ZkProtocol } from "./zk-protocol";
import { genSignalHash, poseidonHash } from "./utils";
import { Identity, MerkleProof } from '../../types';

class Semaphore extends ZkProtocol {
    genWitness(identity: Identity, merkleProof: MerkleProof, externalNullifier: string | bigint, signal: string, shouldHash = true): any {
        return {
            identity_nullifier: identity.identityNullifier,
            identity_trapdoor: identity.identityTrapdoor,
            identity_path_index: merkleProof.indices,
            path_elements: merkleProof.pathElements,
            external_nullifier: externalNullifier,
            signal_hash: shouldHash ? genSignalHash(signal): signal,
        }
    }

    genNullifierHash(externalNullifier: string | bigint, identityNullifier: string | bigint, nLevels: number): bigint {
        return poseidonHash([BigInt(externalNullifier), BigInt(identityNullifier), BigInt(nLevels)]);
    }

}

export default new Semaphore();