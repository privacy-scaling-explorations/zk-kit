pragma circom 2.1.5;

// circomlib imports
include "./bitify.circom";
include "./escalarmulany.circom";

// ECDH Is a a template which allows to generate a shared secret
// from a private key and a public key
// on the baby jubjub curve
// It is important that the private key is hashed and pruned first
// which can be accomplished using the function 
// deriveScalar from @zk-kit/baby-jubjub
template Ecdh() {
    // the private key must pass through deriveScalar first 
    signal input privateKey;
    signal input publicKey[2];
    
    signal output sharedKey[2];
    
    // convert the private key to its bits representation
    var out[253];
    out = Num2Bits(253)(privateKey);

    // multiply the public key by the private key
    var mulFix[2];
    mulFix = EscalarMulAny(253)(out, publicKey);

    // we can then wire the output to the shared secret signal
    sharedKey <== mulFix;
}
