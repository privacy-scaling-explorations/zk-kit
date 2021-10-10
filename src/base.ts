import * as ethers from 'ethers';
const circomlib = require('circomlib');
import * as bigintConversion from 'bigint-conversion';
import { genEddsaKeyPair, genRandomBuffer, identityCommitmentHasher, poseidonHash, SNARK_FIELD_SIZE } from "./common";
import { EddsaPrivateKey, EddsaPublicKey, EdDSASignature, Hasher, Identity, IncrementalQuinTree, IProof } from './types';
const { groth16 } = require('snarkjs');
const Tree = require('incrementalquintree/build/IncrementalQuinTree');

class BaseSemaphore {

    protected commitmentHasher: Hasher | null = null;

    setHasher(hashFunction: string) {
        const hash = identityCommitmentHasher[hashFunction];
        if (!hash) throw new Error(`${hashFunction} identityCommitment hasher not provided`);

        this.commitmentHasher = hash;
    }

    genIdentity(privKey: Buffer = genRandomBuffer(32),): Identity {
        return {
            keypair: genEddsaKeyPair(privKey),
            identityNullifier: bigintConversion.bufToBigint(genRandomBuffer(31)),
            identityTrapdoor: bigintConversion.bufToBigint(genRandomBuffer(31)),
        }
    }

    serializeIdentity(identity: Identity,): string {
        const data = [
            identity.keypair.privKey.toString('hex'),
            identity.identityNullifier.toString(16),
            identity.identityTrapdoor.toString(16),
        ]
        return JSON.stringify(data)
    }
    
    unSerializeIdentity(serialisedIdentity: string): Identity {
        const data = JSON.parse(serialisedIdentity)
        return {
            keypair: genEddsaKeyPair(Buffer.from(data[0], 'hex')),
            identityNullifier: bigintConversion.hexToBigint(data[1]),
            identityTrapdoor: bigintConversion.hexToBigint(data[2]),
        }
    }

    genNullifierHash(externalNullifier: string | bigint, identityNullifier: string | bigint, nLevels: number): BigInt {
        return poseidonHash([BigInt(externalNullifier), BigInt(identityNullifier), BigInt(nLevels)]);
    }

    genExternalNullifier(plaintext: string): string {
        const _cutOrExpandHexToBytes = (hexStr: string, bytes: number): string => {
            const len = bytes * 2
        
            const h = hexStr.slice(2, len + 2)
            return '0x' + h.padStart(len, '0')
        }
    
        const hashed = ethers.utils.solidityKeccak256(['string'], [plaintext])
        return _cutOrExpandHexToBytes(
            '0x' + hashed.slice(8),
            32,
        )
    }
    
    genSignalHash(signal: string): bigint {
        const converted = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(signal));
        return BigInt(ethers.utils.solidityKeccak256(['bytes'], [converted])) >> BigInt(8);
    }
    
    genMsg(externalNullifier: string, signalHash: BigInt): string {
        return circomlib.mimcsponge.multiHash([
            externalNullifier,
            signalHash,
        ]);
    }

    packToSolidityProof(fullProof: IProof) {
        const { proof, publicSignals } = fullProof;
    
        return {
            a: proof.pi_a.slice(0, 2),
            b: proof.pi_b
                .map((x:any) => x.reverse())
                .slice(0, 2),
            c: proof.pi_c.slice(0, 2),
            inputs: publicSignals.map((x:any) => {
                x = BigInt(x);
                return (x % SNARK_FIELD_SIZE).toString()
            })
        };
    }

    createTree(depth: number, zeroValue: number | BigInt, leavesPerNode: number): IncrementalQuinTree {
        return new Tree.IncrementalQuinTree(depth, zeroValue, leavesPerNode, poseidonHash); 
    }

    verifyProof(vKey: string, fullProof: IProof): Promise<boolean> {
        const { proof, publicSignals } = fullProof;
        return groth16.verify(vKey, publicSignals, proof)
    }

    signMsg(privKey: EddsaPrivateKey, msg: bigint | string): EdDSASignature {
        return circomlib.eddsa.signMiMCSponge(privKey, msg)
    }

    verifySignature(msg: bigint, signature: EdDSASignature, pubKey: EddsaPublicKey): boolean {
        return circomlib.eddsa.verifyMiMCSponge(msg, signature, pubKey)
    }
}

export default BaseSemaphore;
