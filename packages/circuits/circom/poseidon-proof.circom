pragma circom 2.1.5;

include "poseidon.circom";

// This circuit can be used to prove the possession of a pre-image of a
// hash without revealing the pre-image itself. It utilizes the Poseidon
// hash function, a highly efficient and secure hash function suited
// for zero-knowledge proof contexts.
// A scope value can be used to define a nullifier to prevent the same
// proof from being re-used twice.
template PoseidonProof() {
    // The circuit takes two inputs: the pre-image (in) and an additional scope parameter (scope).
    signal input in;
    signal input scope;

    // It applies the Poseidon hash function to the pre-image to produce a hash output (out).
    signal output out;
    out <== Poseidon(1)([in]);

    // A nullifier is also computed using both the pre-image and the scope, providing a value
    // to prevent the same proof from being reused twice.
    signal output nullifier;
    nullifier <== Poseidon(2)([scope, in]);
}
