type EddsaPrivateKey = Buffer;
type EddsaPublicKey = bigint[];

type Hasher = (inputs: bigint[]) => bigint;

interface Identity {
    keypair: EddsaKeyPair,
    identityNullifier: bigint,
    identityTrapdoor: bigint,
}

interface EddsaKeyPair {
    pubKey: EddsaPublicKey,
    privKey: EddsaPrivateKey,
}

type IncrementalQuinTree = any;

interface IProof {
    proof: any, 
    publicSignals: any,
}

interface EdDSASignature {
    R8: BigInt[],
    S: BigInt,
}

interface IWitnessData {
    fullProof: IProof, 
    root: BigInt,
}

export {
    Identity,
    IWitnessData,
    IncrementalQuinTree,
    EddsaPrivateKey,
    EddsaPublicKey,
    EddsaKeyPair,
    EdDSASignature,
    Hasher,
    IProof
}