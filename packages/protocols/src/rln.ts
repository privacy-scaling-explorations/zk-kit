import { ZkProtocol } from "./zk-protocol";
import { genSignalHash, poseidonHash } from "./utils";
import { Fq } from "./utils";


class Rln extends ZkProtocol {
    genWitness(identitySecret: bigint, merkleProof: any, epoch: string | bigint, signal: string, rlnIdentifier: bigint, shouldHash = true): any {
        return {
            identity_secret: identitySecret,
            path_elements: merkleProof.pathElements,
            identity_path_index: merkleProof.indices,
            x: shouldHash ? genSignalHash(signal): signal,
            epoch,
            rln_identifier: rlnIdentifier,
        }
    }

    calculateOutput(identitySecret: bigint, epoch: string, rlnIdentifier: bigint, x: bigint): Array<bigint> {
        const a1: bigint = poseidonHash([identitySecret, BigInt(epoch), rlnIdentifier]);
        const y: bigint = Fq.normalize(a1 * x + identitySecret);
        const nullifier = this.genNullifier(a1, rlnIdentifier);
        return [y, nullifier]
    }

    genNullifier(a1: bigint, rlnIdentifier: bigint): bigint {
        return poseidonHash([a1, rlnIdentifier]);
    }

    retrieveSecret(x1: bigint, x2:bigint, y1:bigint, y2:bigint): bigint {
        const slope = Fq.div(Fq.sub(y2, y1), Fq.sub(x2, x1))
        const privateKey = Fq.sub(y1, Fq.mul(slope, x1));
        return Fq.normalize(privateKey);
    }

    genIdentifier(): bigint {
        return Fq.random();
    }

}

export default new Rln();