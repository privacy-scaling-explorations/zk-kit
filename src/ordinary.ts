const { groth16 } = require('snarkjs');
const circomlib = require('circomlib');
import BaseSemaphore from './base';
import { poseidonHash } from './common';
import { EdDSASignature, Identity, IncrementalQuinTree, IProof, IWitnessData } from './types';
const Tree = require('incrementalquintree/build/IncrementalQuinTree');

class OrdinarySemaphore extends BaseSemaphore {
    genIdentityCommitment(identity: Identity): bigint {
        if(!this.commitmentHasher) throw new Error('Hasher not set');
        const data = [circomlib.babyJub.mulPointEscalar(identity.keypair.pubKey, 8)[0], identity.identityNullifier, identity.identityTrapdoor];
        return this.commitmentHasher(data);
    }

    async genProofFromIdentityCommitments(identity: Identity, 
        externalNullifier: string, 
        signal: string,
        wasmFilePath: string, 
        finalZkeyPath: string, 
        identityCommitments: Array<BigInt>, 
        depth: number, zeroValue: BigInt, 
        leavesPerNode: number): Promise<IWitnessData> {

        const tree: IncrementalQuinTree = new Tree.IncrementalQuinTree(depth, zeroValue, leavesPerNode, poseidonHash);
        const identityCommitment: BigInt = this.genIdentityCommitment(identity);
        const leafIndex = identityCommitments.indexOf(identityCommitment);
        if(leafIndex === -1) throw new Error('This commitment is not registered');

        for(const identityCommitment of identityCommitments) {
            tree.insert(identityCommitment);
        }

        const merkleProof = tree.genMerklePath(leafIndex);

        const fullProof: IProof = await this.genProofFromBuiltTree(identity, signal, merkleProof, externalNullifier, wasmFilePath, finalZkeyPath);
        return {
            fullProof, 
            root: tree.root
        }
    }

    //sometimes identityCommitments array can be to big so we must generate it on server and just use it on frontend
    async genProofFromBuiltTree(identity: Identity, signal: string, merkleProof: any, externalNullifier: string, 
        wasmFilePath: string, finalZkeyPath: string): Promise<IProof> {

        const signalHash: BigInt = this.genSignalHash(signal);
        const msg: string = this.genMsg(externalNullifier, signalHash);
        const signature: EdDSASignature = this.signMsg(identity.keypair.privKey, msg);

        const grothInput: any = {
            identity_pk: identity.keypair.pubKey, 
            identity_nullifier: identity.identityNullifier,
            identity_trapdoor: identity.identityTrapdoor,
            fake_zero: 0,
            auth_sig_s: signature.S,
            identity_path_index: merkleProof.indices,
            path_elements: merkleProof.pathElements,
            auth_sig_r: signature.R8,
            signal_hash: signalHash, 
            external_nullifier: externalNullifier,
        }

        return groth16.fullProve(grothInput, wasmFilePath, finalZkeyPath);
    }

}

export default new OrdinarySemaphore();