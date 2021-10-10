const { groth16 } = require('snarkjs');
import BaseSemaphore from './base';
import { poseidonHash } from './common';
import { Identity, IncrementalQuinTree, IProof, IWitnessData } from './types';
const Tree = require('incrementalquintree/build/IncrementalQuinTree');

class Withdraw {

    genNullifierHash = (nullifier: bigint): bigint => {
        return poseidonHash([nullifier])
    }


    //sometimes identityCommitments array can be to big so we must generate it on server and just use it on frontend
    async genProofFromBuiltTree(noteSecret: bigint, nullifier: bigint, merkleProof: any, wasmFilePath: string, finalZkeyPath: string): Promise<IProof> {
        const grothInput: any = {
            note_secret: noteSecret,
            nullifier,
            path_elements: merkleProof.pathElements,
            path_indices: merkleProof.indices
        }

        // console.log('uso sam ovde', grothInput);

        return groth16.fullProve(grothInput, wasmFilePath, finalZkeyPath);
    }

    verifyProof(vKey: string, fullProof: IProof): Promise<boolean> {
        const { proof, publicSignals } = fullProof;
        return groth16.verify(vKey, publicSignals, proof)
    }
}

export default new Withdraw();