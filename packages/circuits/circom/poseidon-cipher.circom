// Original implementation: https://github.com/weijiekoh/circomlib/blob/feat/poseidon-encryption/circuits/poseidon.circom
// All credits to the original authors
pragma circom 2.1.5;

// we use this file with a different name because 
// the poseidon_old implementation of circomlib
// imports the new version of constants
// so we'd have a name clash if we used the same name
// for the constants
include "./utils/poseidonConstants_old.circom";
// we import this for util functions like Ark, Mix, Sigma
include "./poseidon_old.circom";
include "./comparators.circom";

// Poseidon decryption circuit
// param length: length of the input
// This will fail to generate a proof if the ciphertext
// or any of the other inputs are invalid
template PoseidonDecrypt(length) {
    // the length of the decrypted output 
    // must be a multiple of 3
    // e.g. if length == 4, decryptedLength == 6
    var decryptedLength = length;
    while (decryptedLength % 3 != 0) {
        decryptedLength++;
    }

    signal input ciphertext[decryptedLength+1];
    signal input nonce;
    signal input key[2];
    signal output decrypted[decryptedLength];

    component iterations = PoseidonDecryptIterations(length);
    iterations.nonce <== nonce;
    iterations.key[0] <== key[0];
    iterations.key[1] <== key[1];
    for (var i = 0; i < decryptedLength + 1; i++) {
        iterations.ciphertext[i] <== ciphertext[i];
    }

    // check the last ciphertext element
    iterations.decryptedLast === ciphertext[decryptedLength];

    for (var i = 0; i < decryptedLength; i ++) {
        decrypted[i] <== iterations.decrypted[i];
    }

    // If length > 3, check if the last (3 - (l mod 3)) elements of the message
    // are 0
    if (length % 3 > 0) {
        if (length % 3 == 2) {
            decrypted[decryptedLength - 1] === 0;
        } else if (length % 3 == 2) {
            decrypted[decryptedLength - 1] === 0;
            decrypted[decryptedLength - 2] === 0;
        }
    }
} 

// Decrypt a ciphertext without checking if the last ciphertext element or
// whether the last 3 - (l mod 3) elements are 0. This is useful in
// applications where you do not want an invalid decryption to prevent the
// generation of a proof.
template PoseidonDecryptWithoutCheck(length) {
    // the length of the decrypted output 
    // must be a multiple of 3
    // e.g. if length == 4, decryptedLength == 6
    var decryptedLength = length;
    while (decryptedLength % 3 != 0) {
        decryptedLength++;
    }

    signal input ciphertext[decryptedLength+1];
    signal input nonce;
    signal input key[2];
    signal output decrypted[decryptedLength];

    component iterations = PoseidonDecryptIterations(length);
    iterations.nonce <== nonce;
    iterations.key[0] <== key[0];
    iterations.key[1] <== key[1];
    for (var i = 0; i < decryptedLength + 1; i++) {
        iterations.ciphertext[i] <== ciphertext[i];
    }

    for (var i = 0; i < decryptedLength; i ++) {
        decrypted[i] <== iterations.decrypted[i];
    }
}

// Iteratively decrypt a ciphertext
template PoseidonDecryptIterations(length) {
    // if calling this template directly we need to 
    // ensure that the ciphertext length is a multiple of 3
    var decryptedLength = length;
    while (decryptedLength % 3 != 0) {
        decryptedLength += 1;
    }

    // the ciphertext to decrypt
    signal input ciphertext[decryptedLength + 1];
    // nonce passed in while encrypting
    signal input nonce;
    // the decryption key 
    signal input key[2];

    signal output decrypted[decryptedLength];
    signal output decryptedLast;

    var two128 = 2 ** 128;

    // nonce must be < 2^128
    component lt = LessThan(252);
    lt.in[0] <== nonce;
    lt.in[1] <== two128;
    lt.out === 1;

    // calculate the number of iterations 
    // needed for the decryption
    // process
    // \ is integer division
    var n = (decryptedLength + 1) \ 3;

    // we store our strategies in an array
    component strategies[n+1];
    // iterate poseidon on the initial state
    strategies[0] = PoseidonPerm(4);

    // we need to set the initial state to 
    // [0, key[0], key[1], nonce + (length * 2^128)]
    // so we create one extra component 
    // and run a permutation so we can set the state
    strategies[0].inputs[0] <== 0;
    strategies[0].inputs[1] <== key[0];
    strategies[0].inputs[2] <== key[1];
    strategies[0].inputs[3] <== nonce + (length * two128);
    
    // loop for n iterations
    for (var i = 0; i < n; i++) {
        // release three elements of the message
        for (var j = 0; j < 3; j++) {
            decrypted[i * 3 + j] <== ciphertext[i * 3 + j] - strategies[i].out[j + 1];
        }

        // create a new PoseidonPerm component
        // at the next index 
        // because we already passed all values to the 
        // first component
        strategies[i + 1] = PoseidonPerm(4);
        strategies[i + 1].inputs[0] <== strategies[i].out[0];

        // set the inputs from the ciphertext 
        for (var j = 0; j < 3; j++) {
            strategies[i + 1].inputs[j + 1] <== ciphertext[i * 3 + j];
        }
    }
    
    // pass in the last
    decryptedLast <== strategies[n].out[1];
}

// Perform poseidon permutation on a nInputs input
// The difference with circomlib Poseidon implementation
// is that this one returns all of the intermediate values
template PoseidonPerm(nInputs) {
    signal input inputs[nInputs];
    signal output out[nInputs];

    // Using recommended parameters from whitepaper https://eprint.iacr.org/2019/458.pdf (table 2, table 8)
    // Generated by https://extgit.iaik.tugraz.at/krypto/hadeshash/-/blob/master/code/calc_round_numbers.py
    // And rounded up to nearest integer that divides by t
    var N_ROUNDS_P[16] = [56, 57, 56, 60, 60, 63, 64, 63, 60, 66, 60, 65, 70, 60, 64, 68];
    var nRoundsF = 8;
    var nRoundsP = N_ROUNDS_P[nInputs - 2];
    var C[nInputs*(nRoundsF + nRoundsP)] = POSEIDON_C_OLD(nInputs);
    var M[nInputs][nInputs] = POSEIDON_M_OLD(nInputs);

    component ark[nRoundsF + nRoundsP];
    component sigmaF[nRoundsF][nInputs];
    component sigmaP[nRoundsP];
    component mix[nRoundsF + nRoundsP];

    var k;

    for (var i=0; i<nRoundsF + nRoundsP; i++) {
        ark[i] = Ark(nInputs, C, nInputs*i);
        for (var j=0; j<nInputs; j++) {
            if (i==0) {
                ark[i].in[j] <== inputs[j];
            } else {
                ark[i].in[j] <== mix[i-1].out[j];
            }
        }

        if (i < nRoundsF/2 || i >= nRoundsP + nRoundsF/2) {
            k = i < nRoundsF/2 ? i : i - nRoundsP;
            mix[i] = Mix(nInputs, M);
            for (var j=0; j<nInputs; j++) {
                sigmaF[k][j] = Sigma();
                sigmaF[k][j].in <== ark[i].out[j];
                mix[i].in[j] <== sigmaF[k][j].out;
            }
        } else {
            k = i - nRoundsF/2;
            mix[i] = Mix(nInputs, M);
            sigmaP[k] = Sigma();
            sigmaP[k].in <== ark[i].out[0];
            mix[i].in[0] <== sigmaP[k].out;
            for (var j=1; j<nInputs; j++) {
                mix[i].in[j] <== ark[i].out[j];
            }
        }
    }

    // we wire the final state to the output array
    for (var i = 0; i < nInputs; i++) {
        out[i] <== mix[nRoundsF + nRoundsP -1].out[i];
    }
}
