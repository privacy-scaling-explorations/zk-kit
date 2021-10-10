const { groth16 } = require('snarkjs');
import BaseSemaphore from './base';
import { poseidonHash, SNARK_FIELD_SIZE } from './common';
import { Identity, IncrementalQuinTree, IProof, IWitnessData } from './types';
const Tree = require('incrementalquintree/build/IncrementalQuinTree');
import * as bigintConversion from 'bigint-conversion';
const ZqField = require('ffjavascript').ZqField;
const Fq = new ZqField(SNARK_FIELD_SIZE);

class NRLN extends BaseSemaphore {

    genIdentitySecrets(n: number): Array<bigint> {
        return Array.from({length: n}, () => Fq.random());
    }

    genIdentityCommitment(identitySecret: Array<bigint>): bigint {
        if(!this.commitmentHasher) throw new Error('Hasher not set');
        return this.commitmentHasher([this.commitmentHasher(identitySecret)]);
    }

    calculateOutput(identitySecret: Array<bigint>, epoch: bigint, x:bigint, limit: number): Array<bigint> {
        if(!this.commitmentHasher) throw new Error('Hasher not set');
        if(!identitySecret.length) throw new Error('Secret empty');

        const a0 = this.commitmentHasher(identitySecret);

        const coeffs: Array<bigint> = [];
        let tmpX = x;

        coeffs.push(poseidonHash([identitySecret[0], epoch]));
        // let y:bigint = Fq.normalize(coeffs[0] * tmpX + a0);
        let y:bigint = Fq.add(Fq.mul(coeffs[0], tmpX), a0);

        for(let i = 1; i < limit; i++) {   
            tmpX = Fq.mul(x, tmpX);

            coeffs.push(poseidonHash([identitySecret[i], epoch]));
            y = Fq.add(y, Fq.mul(coeffs[i], tmpX));
        }

        const nullifier: bigint = this.calculateNullifier(coeffs);
        return [y, nullifier];
    }

    calculateNullifier(coeffs: Array<bigint>): bigint {
        return poseidonHash(coeffs);
    }

    retrievePrivateKey(xs: Array<bigint>, ys: Array<bigint>): bigint {
        if(xs.length !== ys.length) throw new Error('x and y arrays must be of same size');
        const numOfPoints: number = xs.length;
        let f0: bigint = BigInt(0);
        for(let i = 0; i < numOfPoints; i++) {
            let p: bigint = BigInt(1);
            for(let j = 0; j < numOfPoints; j++) {
                if(j !== i) {
                    p = Fq.mul(p, Fq.div(xs[j], Fq.sub(xs[j], xs[i])))
                }
            }
            f0 = Fq.add(f0, Fq.mul(ys[i], p));
        } 
        return f0;
    }


    async genProofFromIdentityCommitments(identitySecret: Array<bigint>, 
        epoch: string | bigint, 
        signal: string, 
        wasmFilePath: string, 
        finalZkeyPath: string, 
        identityCommitments: Array<BigInt>, 
        depth: number, zeroValue: BigInt, 
        leavesPerNode: number, ): Promise<IWitnessData> {

        const tree: IncrementalQuinTree = new Tree.IncrementalQuinTree(depth, zeroValue, leavesPerNode, poseidonHash);
        const identityCommitment: BigInt = this.genIdentityCommitment(identitySecret);
        const leafIndex = identityCommitments.indexOf(identityCommitment);
        if(leafIndex === -1) throw new Error('This commitment is not registered');
        
        for(const identityCommitment of identityCommitments) {
            tree.insert(identityCommitment);
        }

        const merkleProof = tree.genMerklePath(leafIndex);
        
        const fullProof: IProof = await this.genProofFromBuiltTree(identitySecret, merkleProof, epoch, signal, wasmFilePath, finalZkeyPath);
        return {
            fullProof, 
            root: tree.root
        }
    }

    //sometimes identityCommitments array can be to big so we must generate it on server and just use it on frontend
    async genProofFromBuiltTree(identitySecret: Array<bigint>, merkleProof: any, epoch: string | bigint, signal: string,
        wasmFilePath: string, finalZkeyPath: string): Promise<IProof> {

            const grothInput: any = {
                identity_secret: identitySecret,
                path_elements: merkleProof.pathElements,
                identity_path_index: merkleProof.indices,
                epoch,
                x: this.genSignalHash(signal),
            }

        return groth16.fullProve(grothInput, wasmFilePath, finalZkeyPath);
    }

}

export default new NRLN();