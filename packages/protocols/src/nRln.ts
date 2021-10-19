import { ZkProtocol } from "./zk-protocol";
import { genSignalHash, poseidonHash } from "./utils";
import { Fq } from "./utils";
import { Identity } from "@libsem/types";

class NRln extends ZkProtocol {
  genWitness(identity: Identity, merkleProof: any, epoch: string | bigint, signal: string, shouldHash = true): any {
    return {
      identity_secret: [identity.identityTrapdoor, identity.identityNullifier],
      path_elements: merkleProof.pathElements,
      identity_path_index: merkleProof.indices,
      x: shouldHash ? genSignalHash(signal) : signal,
      epoch,
    };
  }

  //TODO add rln identifier
  calculateOutput(identitySecret: Array<bigint>, epoch: bigint, x: bigint, limit: number): Array<bigint> {
    const a0 = poseidonHash(identitySecret);

    const coeffs: Array<bigint> = [];
    let tmpX = x;

    coeffs.push(poseidonHash([identitySecret[0], epoch]));
    let y: bigint = Fq.add(Fq.mul(coeffs[0], tmpX), a0);

    for (let i = 1; i < limit; i++) {
      tmpX = Fq.mul(x, tmpX);

      coeffs.push(poseidonHash([identitySecret[i], epoch]));
      y = Fq.add(y, Fq.mul(coeffs[i], tmpX));
    }

    const nullifier: bigint = this.genNullifier(coeffs);
    return [y, nullifier];
  }

  genNullifier(coeffs: Array<bigint>): bigint {
    return poseidonHash(coeffs);
  }

  retrieveSecret(xs: Array<bigint>, ys: Array<bigint>): bigint {
    if (xs.length !== ys.length) throw new Error("x and y arrays must be of same size");
    const numOfPoints: number = xs.length;
    let f0 = BigInt(0);
    for (let i = 0; i < numOfPoints; i++) {
      let p = BigInt(1);
      for (let j = 0; j < numOfPoints; j++) {
        if (j !== i) {
          p = Fq.mul(p, Fq.div(xs[j], Fq.sub(xs[j], xs[i])));
        }
      }
      f0 = Fq.add(f0, Fq.mul(ys[i], p));
    }
    return f0;
  }
}

export default new NRln();

