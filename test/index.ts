import * as ethers from 'ethers';
import { FastSemaphore, OrdinarySemaphore, Identity, RLN, NRLN, Withdraw } from '../src/index';
import * as path from 'path';
import * as fs from 'fs';
import { IWitnessData, IProof } from '../src/types';
import * as bigintConversion from 'bigint-conversion';

const snarkjs = require('snarkjs');
import * as circomlib from 'circomlib';
import { poseidonHash } from '../src/common';

const SNARK_FIELD_SIZE: bigint = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const ZqField = require('ffjavascript').ZqField;
const Fq = new ZqField(SNARK_FIELD_SIZE);

const ZERO_VALUE = BigInt(ethers.utils.solidityKeccak256(['bytes'], [ethers.utils.toUtf8Bytes('Semaphore')]));

async function testFastSemaphore() {
    const leafIndex = 3;
    const idCommitments: Array<any> = [];

    FastSemaphore.setHasher('poseidon');

    for (let i=0; i<leafIndex;i++) {
      const tmpIdentity = FastSemaphore.genIdentity();
      const tmpCommitment: any = FastSemaphore.genIdentityCommitment(tmpIdentity);
      idCommitments.push(tmpCommitment);
    }

    const identity: Identity = FastSemaphore.genIdentity();
    const externalNullifier: string = FastSemaphore.genExternalNullifier("voting_1");
    const signal: string = '0x111';
    const nullifierHash: BigInt = FastSemaphore.genNullifierHash(externalNullifier, identity.identityNullifier, 20);
    const identityCommitment: BigInt = FastSemaphore.genIdentityCommitment(identity);
    idCommitments.push(identityCommitment);

    const vkeyPath: string = path.join('./fast-zkeyFiles', 'verification_key.json');
    const vKey = JSON.parse(fs.readFileSync(vkeyPath, 'utf-8'));

    const wasmFilePath: string = path.join('./fast-zkeyFiles', 'semaphore.wasm');
    const finalZkeyPath: string = path.join('./fast-zkeyFiles', 'semaphore_final.zkey');

    const witnessData: IWitnessData = await FastSemaphore.genProofFromIdentityCommitments(identity, externalNullifier, signal, wasmFilePath, finalZkeyPath, 
        idCommitments, 20, ZERO_VALUE, 5);
    const pubSignals = [witnessData.root, nullifierHash, FastSemaphore.genSignalHash(signal), externalNullifier];

    const res = await FastSemaphore.verifyProof(vKey, { proof: witnessData.fullProof.proof, publicSignals: pubSignals });
    if (res === true) {
        console.log("Verification OK");
    } else {
        console.log("Invalid proof");
    }
}

async function testOrdinarySemaphore() {
    const leafIndex = 3;
    const idCommitments: Array<any> = [];

    OrdinarySemaphore.setHasher('pedersen');

    for (let i=0; i<leafIndex;i++) {
      const tmpIdentity = OrdinarySemaphore.genIdentity();
      const tmpCommitment: any = OrdinarySemaphore.genIdentityCommitment(tmpIdentity);
      idCommitments.push(tmpCommitment);
    }

    const identity = OrdinarySemaphore.genIdentity();
    const externalNullifier = OrdinarySemaphore.genExternalNullifier("voting_1");
    const signal: string = '0x111';
    const nullifierHash: BigInt = OrdinarySemaphore.genNullifierHash(externalNullifier, identity.identityNullifier, 20);
    const identityCommitment: BigInt = OrdinarySemaphore.genIdentityCommitment(identity);
    idCommitments.push(identityCommitment);

    const vkeyPath: string = path.join('./ordinary-zkeyFiles', 'verification_key.json');
    const vKey = JSON.parse(fs.readFileSync(vkeyPath, 'utf-8'));

    const wasmFilePath: string = path.join('./ordinary-zkeyFiles', 'semaphore.wasm');
    const finalZkeyPath: string = path.join('./ordinary-zkeyFiles', 'semaphore_final.zkey');

    const witnessData: IWitnessData = await OrdinarySemaphore.genProofFromIdentityCommitments(identity, externalNullifier, signal, wasmFilePath, finalZkeyPath, 
        idCommitments, 20, ZERO_VALUE, 5);
    const pubSignals = [witnessData.root, nullifierHash, OrdinarySemaphore.genSignalHash(signal), externalNullifier];

    const res = await FastSemaphore.verifyProof(vKey, { proof: witnessData.fullProof.proof, publicSignals: pubSignals });
    if (res === true) {
        console.log("Verification OK");
    } else {
        console.log("Invalid proof");
    }
}

async function testOxSemaphore() {
    const leafIndex = 3;
    const idCommitments: Array<any> = [];

    OrdinarySemaphore.setHasher('poseidon');

    for (let i=0; i<leafIndex;i++) {
      const tmpIdentity = OrdinarySemaphore.genIdentity();
      const tmpCommitment: any = OrdinarySemaphore.genIdentityCommitment(tmpIdentity);
      idCommitments.push(tmpCommitment);
    }

    const identity = OrdinarySemaphore.genIdentity();
    const externalNullifier = OrdinarySemaphore.genExternalNullifier("voting_1");
    const signal: string = '0x111';
    const nullifierHash: BigInt = OrdinarySemaphore.genNullifierHash(externalNullifier, identity.identityNullifier, 15);
    const identityCommitment: BigInt = OrdinarySemaphore.genIdentityCommitment(identity);
    idCommitments.push(identityCommitment);

    const vkeyPath: string = path.join('./ox-zkeyFiles', 'verification_key.json');
    const vKey = JSON.parse(fs.readFileSync(vkeyPath, 'utf-8'));

    const wasmFilePath: string = path.join('./ox-zkeyFiles', 'semaphore.wasm');
    const finalZkeyPath: string = path.join('./ox-zkeyFiles', 'semaphore_final.zkey');

    const witnessData: IWitnessData = await OrdinarySemaphore.genProofFromIdentityCommitments(identity, externalNullifier, signal, wasmFilePath, finalZkeyPath, 
        idCommitments, 15, ZERO_VALUE, 2);
    const pubSignals = [witnessData.root, nullifierHash, OrdinarySemaphore.genSignalHash(signal), externalNullifier];
    
    const res = await FastSemaphore.verifyProof(vKey, { proof: witnessData.fullProof.proof, publicSignals: pubSignals });
    if (res === true) {
        console.log("Verification OK");
    } else {
        console.log("Invalid proof");
    }
}

async function testOxContractState() {
    OrdinarySemaphore.setHasher('poseidon');

    let idCommitments: any = [
        '0x0873039d1c56b954d27d634c68f3f5e6332228a4d58a6f81bb5671462c8dd882', 
        '0x02eeb2b4e85f13075ad293162aa97f3df9a20d34435994b1ec248af37b76a794',
        '0x03e2efe7366befcc1e5378ac7d990d3be3e3576c3e83017d34bf8d7a887a817a',
        '0x30382ce83674b37c978bd03c2774a16cc126e757125dab18b99ee885e842583c',
        '0x211f2ef6cdce1a24b5f6741708c53d10839ff8e5d454d263db9c449cf6f9e927',
        '0x1f2c76bf21af6709503697191d63ab9a6d4af3dd6e3b0e2ecc8e5b29a0f8ae63',
        '0x1aee4b734680adccca04257ddb4ace2230a25310b5fc609fda5d192a47a8a441',
        '0x1b6bb82b0c87b672b64e47ee750dee7bc0b9c4fdcdf448611c69190173a19099',
        '0x193e365c13bef8c379907933017faa428339ca54775ab5884e86da3d8ebe8227',
        '0x21e80ad98e33dfab6ff9aae5a5d99640fb9c53ef970591ee8a0d7dd4124443da',
        '0x0d6537fcca0a495e5aeb35ad238b2294e3bf48a0dc4e8654c1f4e121cb9a42ce',
        '0x14ee15704225f23629e90fed18ee9e30af882af4ed278857e94f2b6fd3c1defe',
        '0x1e50d48175f13c4e28e614cdc947969ef11e10266a08add6420121411140c0b3'
    ];

    idCommitments = idCommitments.map((identityCommitment) => {
        return BigInt(identityCommitment);
    })

    const identity = {
        identityTrapdoor: BigInt('82542029366594219626784417739693812950432063422751468466212973853656628726899'),
        identityNullifier: BigInt('44307025453665282376381812629138410756228693677394339594947723099700162176493'), 
        keypair:
            {
                privKey: Buffer.from([64,5,147,12,41,140,236,63,176,143,69,135,110,122,137,132,28,143,211,76,191,9,254,3,5,41,210,202,12,179,104,149]),
                pubKey: [BigInt('186491063589836726875097192691468878036994832524370830178095488685639416053'), BigInt('2064061554138417907435952749246676931538325485445697791392321275199798884063')]
            },
    }

    const externalNullifier = OrdinarySemaphore.genExternalNullifier("voting_1");
    const signal: string = '0x111';
    const nullifierHash: BigInt = OrdinarySemaphore.genNullifierHash(externalNullifier, identity.identityNullifier, 15);

    const vkeyPath: string = path.join('./ox-zkeyFiles', 'verification_key.json');
    const vKey = JSON.parse(fs.readFileSync(vkeyPath, 'utf-8'));

    const wasmFilePath: string = path.join('./ox-zkeyFiles', 'semaphore.wasm');
    const finalZkeyPath: string = path.join('./ox-zkeyFiles', 'semaphore_final.zkey');

    const witnessData: IWitnessData = await OrdinarySemaphore.genProofFromIdentityCommitments(identity, externalNullifier, signal, wasmFilePath, finalZkeyPath, 
        idCommitments, 15, BigInt("0"), 2);
    const pubSignals = [witnessData.root, nullifierHash, OrdinarySemaphore.genSignalHash(signal), externalNullifier];
    
    const res = await FastSemaphore.verifyProof(vKey, { proof: witnessData.fullProof.proof, publicSignals: pubSignals });
    if (res === true) {
        console.log("Verification OK");
    } else {
        console.log("Invalid proof");
    }
}

async function testRLN() {
    RLN.setHasher('poseidon');
    const identity = RLN.genIdentity();
    const identitySecret: bigint = RLN.calculateIdentitySecret(identity);

    const leafIndex = 3;
    const idCommitments: Array<any> = [];

    for (let i=0; i<leafIndex;i++) {
      const tmpIdentity = OrdinarySemaphore.genIdentity();
      const tmpSecret: bigint = RLN.calculateIdentitySecret(tmpIdentity);
      const tmpCommitment: any = RLN.genIdentityCommitment(tmpSecret);
      idCommitments.push(tmpCommitment);
    }

    idCommitments.push(RLN.genIdentityCommitment(identitySecret))

    const signal = 'hey hey';
    const signalHash: bigint = OrdinarySemaphore.genSignalHash(signal);
    const epoch: string = OrdinarySemaphore.genExternalNullifier('test-epoch');

    const rlnIdentifier: bigint = RLN.genIdentifier();

    const vkeyPath: string = path.join('./rln-zkeyFiles', 'verification_key.json');
    const vKey = JSON.parse(fs.readFileSync(vkeyPath, 'utf-8'));

    const wasmFilePath: string = path.join('./rln-zkeyFiles', 'rln.wasm');
    const finalZkeyPath: string = path.join('./rln-zkeyFiles', 'rln_final.zkey');

    const witnessData: IWitnessData = await RLN.genProofFromIdentityCommitments(identitySecret, epoch, signal, wasmFilePath, finalZkeyPath, idCommitments, 15, BigInt(0), 2, rlnIdentifier);

    const a1 = RLN.calculateA1(identitySecret, epoch, rlnIdentifier);
    const y = RLN.calculateY(a1, identitySecret, signalHash);
    const nullifier = RLN.genNullifier(a1, rlnIdentifier);

    const pubSignals = [y, witnessData.root, nullifier, signalHash, epoch, rlnIdentifier];

    const res = await RLN.verifyProof(vKey, { proof: witnessData.fullProof.proof, publicSignals: pubSignals })
    if (res === true) {
        console.log("Verification OK");
    } else {
        console.log("Invalid proof");
    }
}

async function testGeneralizedRLN() {
    NRLN.setHasher('poseidon');
    const limit = 1;
    const identitySecret: Array<bigint> = NRLN.genIdentitySecrets(limit);

    const leafIndex = 3;
    const idCommitments: Array<any> = [];

    for (let i=0; i<leafIndex;i++) {
      const tmpIdentity = NRLN.genIdentitySecrets(limit);
      const tmpCommitment: any = NRLN.genIdentityCommitment(tmpIdentity);
      idCommitments.push(tmpCommitment);
    }

    idCommitments.push(NRLN.genIdentityCommitment(identitySecret));

    const signal = 'hey hey';
    const signalHash: bigint = NRLN.genSignalHash(signal);
    const epoch: string = NRLN.genExternalNullifier('test-epoch');

    // const rlnIdentifier: bigint = RLN.genIdentifier();

    const vkeyPath: string = path.join('./g-rln-zkeyFiles', 'verification_key.json');
    const vKey = JSON.parse(fs.readFileSync(vkeyPath, 'utf-8'));

    const wasmFilePath: string = path.join('./g-rln-zkeyFiles', 'rln.wasm');
    const finalZkeyPath: string = path.join('./g-rln-zkeyFiles', 'rln_final.zkey');

    const witnessData: IWitnessData = await NRLN.genProofFromIdentityCommitments(identitySecret, epoch, signal, wasmFilePath, finalZkeyPath, idCommitments, 15, BigInt(0), 2);

    const [y, nullifier] = NRLN.calculateOutput(identitySecret, bigintConversion.hexToBigint(epoch.slice(2)), signalHash, limit);
    const pubSignals = [y, witnessData.root, nullifier, signalHash, epoch];

    const res = await RLN.verifyProof(vKey, { proof: witnessData.fullProof.proof, publicSignals: pubSignals })
    if (res === true) {
        console.log("Verification OK");
    } else {
        console.log("Invalid proof");
    }
}

async function testGeneralizedRLNSlashing() {
    NRLN.setHasher('poseidon');
    const limit = 1;
    const identitySecret: Array<bigint> = NRLN.genIdentitySecrets(limit);
    const secret = poseidonHash(identitySecret);
    const epoch: string = NRLN.genExternalNullifier('test-slashing');


    const x1 = Fq.random();
    const [y1, nullifier1] = NRLN.calculateOutput(identitySecret, bigintConversion.hexToBigint(epoch.slice(2)), x1, limit);

    const x2 = Fq.random();
    const [y2, nullifier2] = NRLN.calculateOutput(identitySecret, bigintConversion.hexToBigint(epoch.slice(2)), x2, limit);

    const f0 = NRLN.retrievePrivateKey([x1, x2], [y1, y2]);
    console.log('NRLN Secret retrieval: ', Fq.eq(f0, secret));

}

async function testRlnSlopeCalculation() {
    RLN.setHasher('poseidon');
    const identity = RLN.genIdentity();
    const identitySecret: bigint = RLN.calculateIdentitySecret(identity);

    const signal1 = 'hey hey';
    const x1: bigint = OrdinarySemaphore.genSignalHash(signal1);
    const epoch: string = OrdinarySemaphore.genExternalNullifier('test-epoch');

    const rlnIdentifier: bigint = RLN.genIdentifier();

    const a1 = RLN.calculateA1(identitySecret, epoch, rlnIdentifier);
    const y1 = RLN.calculateY(a1, identitySecret, x1);

    const signal2 = 'hey hey once again';
    const x2: bigint = OrdinarySemaphore.genSignalHash(signal2);

    const a2 = RLN.calculateA1(identitySecret, epoch, rlnIdentifier);
    const y2 = RLN.calculateY(a2, identitySecret, x2);

    const retreivedPkey: bigint = RLN.retrievePrivateKey(x1, x2, y1, y2);

    console.log('PK successfully retrieved: ', Fq.eq(identitySecret, retreivedPkey));
}


async function testRlnSlashingSimulation() {
    RLN.setHasher('poseidon');
    const identity = RLN.genIdentity();
    const identitySecret: bigint = RLN.calculateIdentitySecret(identity);

    const leafIndex = 3;
    const idCommitments: Array<any> = [];

    for (let i=0; i<leafIndex;i++) {
        const tmpIdentity = OrdinarySemaphore.genIdentity();
        const tmpSecret: bigint = RLN.calculateIdentitySecret(tmpIdentity);
        const tmpCommitment: any = RLN.genIdentityCommitment(tmpSecret);
        idCommitments.push(tmpCommitment);
    }

    idCommitments.push(RLN.genIdentityCommitment(identitySecret))

    const signal = 'hey hey';
    const x1: bigint = OrdinarySemaphore.genSignalHash(signal);
    const epoch: string = OrdinarySemaphore.genExternalNullifier('test-epoch');

    const rlnIdentifier = RLN.genIdentifier();

    const vkeyPath: string = path.join('./rln-zkeyFiles', 'verification_key.json');
    const vKey = JSON.parse(fs.readFileSync(vkeyPath, 'utf-8'));

    const wasmFilePath: string = path.join('./rln-zkeyFiles', 'rln.wasm');
    const finalZkeyPath: string = path.join('./rln-zkeyFiles', 'rln_final.zkey');

    const witnessData: IWitnessData = await RLN.genProofFromIdentityCommitments(identitySecret, epoch, signal, wasmFilePath, finalZkeyPath, idCommitments, 15, BigInt(0), 2, rlnIdentifier);

    const a1 = RLN.calculateA1(identitySecret, epoch, rlnIdentifier);
    const y1 = RLN.calculateY(a1, identitySecret, x1);
    const nullifier = RLN.genNullifier(a1, rlnIdentifier);

    const pubSignals = [y1, witnessData.root, nullifier, x1, epoch, rlnIdentifier];

    let res = await RLN.verifyProof(vKey, { proof: witnessData.fullProof.proof, publicSignals: pubSignals })
    if (res === true) {
        console.log("Verification OK");
    } else {
        console.log("Invalid proof");
        return;
    }

    const signalSpam = "let's try spamming";
    const x2: bigint = OrdinarySemaphore.genSignalHash(signalSpam);

    const witnessDataSpam: IWitnessData = await RLN.genProofFromIdentityCommitments(identitySecret, epoch, signalSpam, wasmFilePath, finalZkeyPath, idCommitments, 15, BigInt(0), 2, rlnIdentifier);

    const a1Spam = RLN.calculateA1(identitySecret, epoch, rlnIdentifier);
    const y2 = RLN.calculateY(a1Spam, identitySecret, x2);
    const nullifierSpam = RLN.genNullifier(a1Spam, rlnIdentifier);

    const pubSignalsSpam = [y2, witnessDataSpam.root, nullifierSpam, x2, epoch, rlnIdentifier];

    res = await RLN.verifyProof(vKey, { proof: witnessDataSpam.fullProof.proof, publicSignals: pubSignalsSpam })
    if (res === true) {
        console.log("Spam proof Verification OK");
    } else {
        console.log("Invalid proof");
        return;
    }

    const retreivedPkey: bigint = RLN.retrievePrivateKey(x1, x2, y1, y2);

    if(Fq.eq(identitySecret, retreivedPkey)) {
        console.log("PK successfully reconstructed");
    } else {
        console.log("Error while reconstructing private key")
    }

    // TODO: Add removal from tree example
}


async function testFieldArithmetic() {
    const k = Fq.random();
    const n = Fq.random();

    const x1 = Fq.random();
    const y1 = Fq.add(Fq.mul(k, x1), n);

    const x2 = Fq.random();
    const y2 = Fq.add(Fq.mul(k, x2), n);

    const ydiff = Fq.sub(y2, y1);
    const xdiff = Fq.sub(x2, x1);

    // console.log(ydiff, xdiff);

    const slope = Fq.div(ydiff, xdiff);
    const retrievedN = Fq.sub(y1, Fq.mul(x1, slope));

    console.log(Fq.eq(n, retrievedN));
}

async function lagrangeOverFq() {

    const numOfPoints: number = 2;

    // for(let i = 0; i < n; i++) {
    //     xs[i] = Fq.random();
    //     ys[i] = Fq.random();
    // }

    const xs: Array<bigint> = [];
    const ys: Array<bigint> = [];

    const k = Fq.random();
    const n = Fq.random();

    const x1 = Fq.random();
    const y1 = Fq.add(Fq.mul(k, x1), n);

    const x2 = Fq.random();
    const y2 = Fq.add(Fq.mul(k, x2), n);

    xs.push(x1);
    xs.push(x2);

    ys.push(y1);
    ys.push(y2);

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

    console.log('Lagrange:', Fq.eq(f0, n));
}

async function testFairDistributionCircuits() {
    RLN.setHasher('poseidon');
    const identity = RLN.genIdentity();
    const identitySecret: bigint = RLN.calculateIdentitySecret(identity);

    const leafIndex = 3;
    const idCommitments: Array<any> = [];

    for (let i=0; i<leafIndex;i++) {
      const tmpIdentity = OrdinarySemaphore.genIdentity();
      const tmpSecret: bigint = RLN.calculateIdentitySecret(tmpIdentity);
      const tmpCommitment: any = RLN.genIdentityCommitment(tmpSecret);
      idCommitments.push(tmpCommitment);
    }

    idCommitments.push(RLN.genIdentityCommitment(identitySecret));

    const noteSecret: bigint = Fq.random();
    const noteNullifier: bigint = Fq.random();

    const noteCommitmnet = poseidonHash([noteSecret, noteNullifier]);
    const noteNullifierHash = Withdraw.genNullifierHash(noteNullifier);

    const signal = bigintConversion.bigintToText(noteCommitmnet);
    const signalHash: bigint = OrdinarySemaphore.genSignalHash(signal);
    const epoch: string = OrdinarySemaphore.genExternalNullifier('test-epoch');

    const rlnIdentifier: bigint = RLN.genIdentifier();

    const vkeyPath: string = path.join('./rln-zkeyFiles', 'verification_key.json');
    const vKey = JSON.parse(fs.readFileSync(vkeyPath, 'utf-8'));

    const wasmFilePath: string = path.join('./rln-zkeyFiles', 'rln.wasm');
    const finalZkeyPath: string = path.join('./rln-zkeyFiles', 'rln_final.zkey');

    const witnessData: IWitnessData = await RLN.genProofFromIdentityCommitments(identitySecret, epoch, signal, wasmFilePath, finalZkeyPath, idCommitments, 15, BigInt(0), 2, rlnIdentifier);

    const a1 = RLN.calculateA1(identitySecret, epoch, rlnIdentifier);
    const y = RLN.calculateY(a1, identitySecret, signalHash);
    const nullifier = RLN.genNullifier(a1, rlnIdentifier);

    const pubSignals = [y, witnessData.root, nullifier, signalHash, epoch, rlnIdentifier];

    const res = await RLN.verifyProof(vKey, { proof: witnessData.fullProof.proof, publicSignals: pubSignals })
    if (res === true) {
        console.log("Verification OK");
    } else {
        console.log("Invalid proof");
    }

    const notesTree = RLN.createTree(20, BigInt(0), 2);
    // if verification was ok, add note_commitment to tree and try to withdraw it
    if(res === true) {
        console.log('DEPOSIT WAS SUCCESSFUL');
        const withdrawalVkeyPath: string = path.join('./fair-zkeyFiles', 'witdraw', 'verification_key.json');
        const withdrawalVKey = JSON.parse(fs.readFileSync(withdrawalVkeyPath, 'utf-8'));
    
        const withdrawalWasmFilePath: string = path.join('./fair-zkeyFiles', 'witdraw', 'witdraw.wasm');
        const withdrawalFinalZkeyPath: string = path.join('./fair-zkeyFiles', 'witdraw', 'witdraw_final.zkey');

        notesTree.insert(noteCommitmnet);

        const withdrawalMerkleProof = notesTree.genMerklePath(0);
        const fullProof: IProof = await Withdraw.genProofFromBuiltTree(noteSecret, noteNullifier, withdrawalMerkleProof, withdrawalWasmFilePath, withdrawalFinalZkeyPath);

        const pubSignals = [notesTree.root, noteNullifierHash];


        const withdrawalRes = await Withdraw.verifyProof(withdrawalVKey, { proof: fullProof.proof, publicSignals: pubSignals })
        if (withdrawalRes === true) {
            console.log("Withdrawal verification OK");
        } else {
            console.log("Withdrawal invalid proof");
        }

    }
}


(async () => {
    await testFastSemaphore();
    await testOrdinarySemaphore();
    await testOxSemaphore();
    await testOxContractState();
    await testRLN();
    await testRlnSlopeCalculation();
    await testFieldArithmetic();
    await testRlnSlashingSimulation();
    await testFairDistributionCircuits();
    await testGeneralizedRLN();
    await testGeneralizedRLNSlashing();
    await lagrangeOverFq();
    process.exit(0);
})();
