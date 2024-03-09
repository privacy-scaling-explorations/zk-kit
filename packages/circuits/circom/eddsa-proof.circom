pragma circom 2.1.5;

include "babyjub.circom";
include "poseidon.circom";

// This circuit can be used to prove the possession of a private key of an
// identity commitment without revealing the private key itself. It utilizes 
// the {@link https://eips.ethereum.org/EIPS/eip-2494|Baby Jubjub} elliptic curve, the Poseidon hash function which a highly efficient 
// and secure hash function suited for zero-knowledge proof contexts.
// A scope value can be used to define a nullifier to prevent the same
// proof from being re-used twice.
template EddsaProof() {
    // The circuit takes two inputs: the private key and an additional scope parameter.
    signal input secret;
    signal input scope;

    signal output commitment;

    var Ax, Ay;

    // Get the two Baby Jubjub points using the private key.
    (Ax, Ay) = BabyPbk()(secret);

    // It applies the Poseidon hash function to the to Baby Jubjub points to produce the commitment.
    commitment <== Poseidon(2)([Ax, Ay]);

    // Dummy constraint to prevent compiler from optimizing it.
    signal dummySquare <== scope * scope;
}
