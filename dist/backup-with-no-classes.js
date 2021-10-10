"use strict";
// // import { verifySignature } from 'libsemaphore';
// import * as crypto from 'crypto';
// import * as circomlib from 'circomlib';
// import * as ethers from 'ethers';
// const { groth16 } = require('snarkjs');
// import * as bigintConversion from 'bigint-conversion';
// const Tree = require('incrementalquintree/build/IncrementalQuinTree');
// const utils = require("ffjavascript").utils;
// const SNARK_FIELD_SIZE: BigInt = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617");
// type EddsaPrivateKey = Buffer;
// type EddsaPublicKey = bigint[];
// type CommitmentDTO = (identity: Identity) => bigint[];
// type Hasher = (inputs: bigint[]) => bigint;
// interface Identity {
//     keypair: EddsaKeyPair,
//     identityNullifier: bigint,
//     identityTrapdoor: bigint,
// }
// interface EddsaKeyPair {
//     pubKey: EddsaPublicKey,
//     privKey: EddsaPrivateKey,
// }
// type IncrementalQuinTree = any;
// interface IProof {
//     proof: any, 
//     publicSignals: any,
// }
// interface EdDSASignature {
//     R8: BigInt[],
//     S: BigInt,
// }
// interface IWitnessData {
//     fullProof: IProof, 
//     root: BigInt,
// }
// // BEGIN HASHERS
// const poseidonHash = (inputs: bigint[]): bigint => {
//     return circomlib.poseidon(inputs)
// }
// const pedersenHash = (inputs: Array<bigint>): bigint => {
//     const p = circomlib.babyJub.unpackPoint(
//         circomlib.pedersenHash.hash(
//             Buffer.concat(
//                 inputs.map((x) => Buffer.from(utils.leInt2Buff(x, 32)))
//             )
//         )
//     )
//     return BigInt(p[0])
// }
// const hashers: {
//     [name: string]: Hasher
// } = {
//     'poseidon': poseidonHash,
//     'pedersen': pedersenHash,
// };
// // END HASHERS
// const toOrdinaryCommitment = (identity: Identity): bigint[] => {
//     return [
//         circomlib.babyJub.mulPointEscalar(identity.keypair.pubKey, 8)[0],
//         identity.identityNullifier,
//         identity.identityTrapdoor,
//     ]
// }
// const toFastSemaphoreCommitment = (identity: Identity): bigint[] => {
//     return [
//         identity.identityNullifier,
//         identity.identityTrapdoor
//     ]
// }
// const commitmentDtos: {
//     [name: string]: CommitmentDTO
// } = {
//     'ordinary': toOrdinaryCommitment,
//     'fast': toFastSemaphoreCommitment
// }
// //BEGIN IDENTITY
// const genRandomBuffer = (numBytes: number = 32): Buffer => {
//     return crypto.randomBytes(numBytes)
// }
// const genPubKey = (privKey: EddsaPrivateKey): EddsaPublicKey => {
//     return circomlib.eddsa.prv2pub(privKey)
// }
// const genEddsaKeyPair = (privKey: Buffer = genRandomBuffer()): EddsaKeyPair => {
//     const pubKey = genPubKey(privKey)
//     return { pubKey, privKey }
// }
// const genIdentity = (
//     privKey: Buffer = genRandomBuffer(32),
// ): Identity => {
//     return {
//         keypair: genEddsaKeyPair(privKey),
//         identityNullifier: bigintConversion.bufToBigint(genRandomBuffer(31)),
//         identityTrapdoor: bigintConversion.bufToBigint(genRandomBuffer(31)),
//     }
// }
// const serialiseIdentity = (
//     identity: Identity,
// ): string => {
//     const data = [
//         identity.keypair.privKey.toString('hex'),
//         identity.identityNullifier.toString(16),
//         identity.identityTrapdoor.toString(16),
//     ]
//     return JSON.stringify(data)
// }
// const unSerialiseIdentity = (serialisedIdentity: string): Identity => {
//     const data = JSON.parse(serialisedIdentity)
//     return {
//         keypair: genEddsaKeyPair(Buffer.from(data[0], 'hex')),
//         identityNullifier: bigintConversion.hexToBigint(data[1]),
//         identityTrapdoor: bigintConversion.hexToBigint(data[2]),
//     }
// }
// const genIdentityCommitment = (identity: Identity, hasher: string, type: string): BigInt => {
//     const hash: Hasher = hashers[hasher];
//     if (!hash) throw new Error(`${hasher} hasher function not supported, did you mean pedersen or poseidon`);
//     const dto: CommitmentDTO = commitmentDtos[type];
//     if (!dto) throw new Error(`${type} of semaphore identity commitment not supported, did you mean ordinary or fast`)
//     const data: bigint[] = dto(identity);
//     return hash(data);
// }
// //END IDENTITY
// /*
//  * Each external nullifier must be at most 29 bytes large. This function
//  * keccak-256-hashes a given `plaintext`, takes the last 29 bytes, and pads it
//  * (from the start) with 0s, and returns the resulting hex string.
//  * @param plaintext The plaintext to hash
//  * @return plaintext The 0-padded 29-byte external nullifier
//  */
// const genExternalNullifier = (plaintext: string): string => {
//     const _cutOrExpandHexToBytes = (hexStr: string, bytes: number): string => {
//         const len = bytes * 2
//         const h = hexStr.slice(2, len + 2)
//         return '0x' + h.padStart(len, '0')
//     }
//     const hashed = ethers.utils.solidityKeccak256(['string'], [plaintext])
//     return _cutOrExpandHexToBytes(
//         '0x' + hashed.slice(8),
//         32,
//     )
// }
// const genSignalHash = (signal: string): BigInt => {
//     const converted = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(signal));
//     return BigInt(ethers.utils.solidityKeccak256(['bytes'], [converted])) >> BigInt(8);
// }
// const genMsg = (externalNullifier: string, signalHash: BigInt): string => {
//     return circomlib.mimcsponge.multiHash([
//         externalNullifier,
//         signalHash,
//     ]);
// }
// const genNullifierHash = (externalNullifier: string | bigint, identityNullifier: string | bigint, nLevels: number): BigInt => {
//     return circomlib.poseidon([BigInt(externalNullifier), BigInt(identityNullifier), BigInt(nLevels)]);
// }
// const genProof_fastSemaphore = async (identity: Identity, signalHash: BigInt, 
//     identityCommitments: Array<BigInt>, externalNullifier: string, depth: number, zeroValue: BigInt, 
//     leavesPerNode: number, wasmFilePath: string, finalZkeyPath: string): Promise<IWitnessData> => {
//     const tree: IncrementalQuinTree = new Tree.IncrementalQuinTree(depth, zeroValue, leavesPerNode, poseidonHash);
//     const identityCommitment: BigInt = genIdentityCommitment(identity, 'poseidon', 'fast');
//     const leafIndex = identityCommitments.indexOf(identityCommitment);
//     for(const identityCommitment of identityCommitments) {
//         tree.insert(identityCommitment);
//     }
//     const proof = tree.genMerklePath(leafIndex);
//     const grothInput: any = {
//         identity_pk: identity.keypair.pubKey, 
//         identity_nullifier: identity.identityNullifier,
//         identity_trapdoor: identity.identityTrapdoor,
//         identity_path_index: proof.indices,
//         path_elements: proof.pathElements,
//         external_nullifier: externalNullifier,
//         signal_hash: signalHash,
//     }
//     const fullProof: IProof = await groth16.fullProve(grothInput, wasmFilePath, finalZkeyPath);
//     const root: BigInt = tree.root;
//     return {
//         fullProof, 
//         root
//     }
// }
// const genProof = async (identity: Identity, signature: EdDSASignature, signalHash: BigInt, 
//     identityCommitments: Array<BigInt>, externalNullifier: string, depth: number, zeroValue: BigInt, 
//     leavesPerNode: number, wasmFilePath: string, finalZkeyPath: string): Promise<IWitnessData> => {
//     const tree: IncrementalQuinTree = new Tree.IncrementalQuinTree(depth, zeroValue, leavesPerNode, poseidonHash);
//     const identityCommitment: BigInt = genIdentityCommitment(identity, 'poseidon', 'ordinary');
//     const leafIndex = identityCommitments.indexOf(identityCommitment);
//     for(const identityCommitment of identityCommitments) {
//         tree.insert(identityCommitment);
//     }
//     const proof = tree.genMerklePath(leafIndex);
//     const grothInput: any = {
//         identity_pk: identity.keypair.pubKey, 
//         identity_nullifier: identity.identityNullifier,
//         identity_trapdoor: identity.identityTrapdoor,
//         fake_zero: 0,
//         auth_sig_s: signature.S,
//         identity_path_index: proof.indices,
//         path_elements: proof.pathElements,
//         auth_sig_r: signature.R8,
//         signal_hash: signalHash, 
//         external_nullifier: externalNullifier,
//     }
//     const fullProof: IProof = await groth16.fullProve(grothInput, wasmFilePath, finalZkeyPath);
//     const root: BigInt = tree.root;
//     return {
//         fullProof, 
//         root
//     }
// }
// const packToSolidityProof = (fullProof: IProof) => {
//     const { proof, publicSignals } = fullProof;
//     return {
//         a: proof.pi_a.slice(0, 2),
//         b: proof.pi_b
//             .map((x:any) => x.reverse())
//             .slice(0, 2),
//         c: proof.pi_c.slice(0, 2),
//         inputs: publicSignals.map((x:any) => {
//             x = BigInt(x);
//             return x.mod(SNARK_FIELD_SIZE).toString()
//         })
//     };
// }
// const verifyProof = (vKey: string, fullProof: IProof): Promise<boolean> => {
//     const { proof, publicSignals } = fullProof;
//     return groth16.verify(vKey, publicSignals, proof)
// }
// const createTree = (depth: number, zeroValue: number | BigInt, leavesPerNode: number): IncrementalQuinTree => {
//     return new Tree.IncrementalQuinTree(depth, zeroValue, leavesPerNode, poseidonHash);
// }
// // SIGNATURE
// const signMsg = (
//     privKey: EddsaPrivateKey,
//     msg: bigint | string,
// ): EdDSASignature => {
//     return circomlib.eddsa.signMiMCSponge(privKey, msg)
// }
// const verifySignature = (
//     msg: bigint,
//     signature: EdDSASignature,
//     pubKey: EddsaPublicKey,
// ): boolean => {
//     return circomlib.eddsa.verifyMiMCSponge(msg, signature, pubKey)
// }
// export {
//     Identity,
//     IncrementalQuinTree,
//     EdDSASignature,
//     IProof,
//     IWitnessData,
//     signMsg,
//     genExternalNullifier,
//     genIdentity,
//     genIdentityCommitment,
//     verifySignature,
//     genSignalHash,
//     genNullifierHash,
//     genMsg,
//     genProof,
//     genProof_fastSemaphore,
//     packToSolidityProof,
//     verifyProof,
//     createTree,
//     serialiseIdentity,
//     unSerialiseIdentity
// }
//# sourceMappingURL=backup-with-no-classes.js.map