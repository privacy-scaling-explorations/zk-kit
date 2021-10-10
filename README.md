# semaphore-lib

### Description

A library that allows for easy access and interoperability for [Semaphore](https://semaphore.appliedzkp.org/) and [RLN](https://medium.com/privacy-scaling-explorations/rate-limiting-nullifier-a-spam-protection-mechanism-for-anonymous-environments-bbe4006a57d) constructs. It is meant to be used by third-party applications to easily integrate with Seamphore and RLN. The library provides an API (Semaphore and RLN) for:
- Identity generation
- Proof generation
- Proof verification


 ### Install instructions

`yarn add git+https://github.com/akinovak/semaphore-lib.git#dev`

### API

The library provides APIs for three different constructs, which are: `OrdinarySemaphore`, `FastSemaphore` and `RLN`. The library provides a base class (`BaseSemaphore`) which provides all the common functions, and the specifics for each construct are implemented on top of the base class as sub classes.

The difference between `OrdinarySemaphore` and `FastSemaphore` is that `FastSemaphore` does not use the EdDSA public key of the user for the identity commitment generation. This allows for "leaner" proofs and zkSNARK with less constrains which leads to better performance (thus the prefix `Fast`). The `OrdinarySemaphore` and `FastSemaphore` have the same interface, however their underlying implementation is different.

#### BaseSemaphore

```typescript
- setHasher(hashFunction: string);
- genIdentity(privKey: Buffer): Identity;
- serializeIdentity(identity: Identity): string;
- unSerializeIdentity(serialisedIdentity: string): Identity;
- genNullifierHash(externalNullifier: string | bigint, identityNullifier: string | bigint, nLevels: number): BigInt;
- genExternalNullifier(plaintext: string): string;
- genMsg(externalNullifier: string, signalHash: BigInt): string;
- packToSolidityProof(fullProof: IProof): object;
- createTree(depth: number, zeroValue: number | BigInt, leavesPerNode: number): IncrementalQuinTree;
- verifyProof(vKey: string, fullProof: IProof): Promise<boolean>;
- signMsg(privKey: EddsaPrivateKey, msg: bigint | string): EdDSASignature;
- verifySignature(msg: bigint, signature: EdDSASignature, pubKey: EddsaPublicKey): boolean;
```

#### OrdinarySemaphore (inherits BaseSemaphore)

```typescript
- genIdentityCommitment(identity: Identity): bigint;
- genProofFromIdentityCommitments(identity: Identity, 
        externalNullifier: string, 
        signal: string,
        wasmFilePath: string, 
        finalZkeyPath: string, 
        identityCommitments: Array<BigInt>, 
        depth: number, zeroValue: BigInt, 
        leavesPerNode: number): Promise<IWitnessData>;
- genProofFromBuiltTree(identity: Identity, signal: string, merkleProof: any, externalNullifier: string, 
        wasmFilePath: string, finalZkeyPath: string): Promise<IProof>;
```

#### FastSempahore (inherits BaseSemaphore)

```typescript
- genIdentityCommitment(identity: Identity): bigint;
- genProofFromIdentityCommitments(identity: Identity, 
        externalNullifier: string | bigint, 
        signal: string, 
        wasmFilePath: string, 
        finalZkeyPath: string, 
        identityCommitments: Array<BigInt>, 
        depth: number, zeroValue: BigInt, 
        leavesPerNode: number): Promise<IWitnessData>
- genProofFromBuiltTree(identity: Identity, merkleProof: any, externalNullifier: string | bigint, signal: string, 
        wasmFilePath: string, finalZkeyPath: string): Promise<IProof>;
```



#### RLN (inherits BaseSemaphore)

```typescript
- calculateIdentitySecret(privateKey: Buffer): bigint;
- calculateA1(privateKey: Buffer, epoch: string): bigint;
- calculateY(a1:bigint, privateKey: Buffer, signalHash: bigint): bigint;
- genNullifier(a1: bigint): bigint;
- retrievePrivateKey(x1: bigint, x2:bigint, y1:bigint, y2:bigint): bigint;
- genIdentityCommitment(privateKey: Buffer): bigint;
- genProofFromIdentityCommitments(privateKey: Buffer, 
        epoch: string | bigint, 
        signal: string, 
        wasmFilePath: string, 
        finalZkeyPath: string, 
        identityCommitments: Array<BigInt>, 
        depth: number, zeroValue: BigInt, 
        leavesPerNode: number): Promise<IWitnessData>;
- genProofFromBuiltTree(privateKey: Buffer, merkleProof: any, epoch: string | bigint, signal: string, 
        wasmFilePath: string, finalZkeyPath: string): Promise<IProof>;
```