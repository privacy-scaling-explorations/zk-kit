const { groth16 } = require('snarkjs');
import BaseSemaphore from './base';
import { poseidonHash, SNARK_FIELD_SIZE } from './common';
import { Identity, IncrementalQuinTree, IProof, IWitnessData } from './types';
const Tree = require('incrementalquintree/build/IncrementalQuinTree');
import * as bigintConversion from 'bigint-conversion';
const ZqField = require('ffjavascript').ZqField;
const Fq = new ZqField(SNARK_FIELD_SIZE);

class RLN extends BaseSemaphore {
    calculateIdentitySecret(identity: Identity): bigint {
        return poseidonHash([identity.identityTrapdoor, identity.identityNullifier]);
    }

    calculateA1(identitySecret: bigint, epoch: string, rlnIdentifier: bigint) {
        return poseidonHash([identitySecret, BigInt(epoch), rlnIdentifier])
    }
    
    calculateY(a1:bigint, identitySecret: bigint, signalHash: bigint): bigint {
        return Fq.normalize(a1 * signalHash + identitySecret);
    }

    genNullifier(a1: bigint, rlnIdentifier: bigint): bigint {
        return poseidonHash([a1, rlnIdentifier]);
    }

    retrievePrivateKey(x1: bigint, x2:bigint, y1:bigint, y2:bigint): bigint {
        const slope = Fq.div(Fq.sub(y2, y1), Fq.sub(x2, x1))
        const privateKey = Fq.sub(y1, Fq.mul(slope, x1));
        return Fq.normalize(privateKey);
    }

    genIdentityCommitment(identitySecret: bigint): bigint {
        if(!this.commitmentHasher) throw new Error('Hasher not set');
        const data = [identitySecret];
        return this.commitmentHasher(data);
    }

    genIdentifier(): bigint {
        return Fq.random();
    }


    async genProofFromIdentityCommitments(identitySecret: bigint, 
        epoch: string | bigint, 
        signal: string, 
        wasmFilePath: string, 
        finalZkeyPath: string, 
        identityCommitments: Array<BigInt>, 
        depth: number, zeroValue: BigInt, 
        leavesPerNode: number, 
        rlnIdentifier: bigint): Promise<IWitnessData> {

        const tree: IncrementalQuinTree = new Tree.IncrementalQuinTree(depth, zeroValue, leavesPerNode, poseidonHash);
        const identityCommitment: BigInt = this.genIdentityCommitment(identitySecret);
        const leafIndex = identityCommitments.indexOf(identityCommitment);
        if(leafIndex === -1) throw new Error('This commitment is not registered');
        
        for(const identityCommitment of identityCommitments) {
            tree.insert(identityCommitment);
        }

        const merkleProof = tree.genMerklePath(leafIndex);
        
        const fullProof: IProof = await this.genProofFromBuiltTree(identitySecret, merkleProof, epoch, signal, rlnIdentifier, wasmFilePath, finalZkeyPath);
        return {
            fullProof, 
            root: tree.root
        }
    }

    //sometimes identityCommitments array can be to big so we must generate it on server and just use it on frontend
    async genProofFromBuiltTree(identitySecret: bigint, merkleProof: any, epoch: string | bigint, signal: string, rlnIdentifier: bigint,
        wasmFilePath: string, finalZkeyPath: string): Promise<IProof> {

            const grothInput: any = {
                identity_secret: identitySecret,
                path_elements: merkleProof.pathElements,
                identity_path_index: merkleProof.indices,
                epoch,
                x: this.genSignalHash(signal),
                rln_identifier: rlnIdentifier,
            }

        return groth16.fullProve(grothInput, wasmFilePath, finalZkeyPath);
    }

}

export default new RLN();