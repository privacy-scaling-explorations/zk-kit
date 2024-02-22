pragma circom 2.1.5;

include "poseidon.circom";

// This circuit can be used to prove the possession of pre-images of a
// hash without revealing the pre-image itself. It utilizes the Poseidon
// hash function, a highly efficient and secure hash function suited
// for zero-knowledge proof contexts. A parameter is defined to specify
// the number of inputs a Poseidon hash function can support 
// (i.e. 'NUMBER_OF_INPUTS').
// A scope value can be used to externally compute a nullifier to prevent 
// the same proof from being re-used twice.
template PoseidonProof(NUMBER_OF_INPUTS) {
    // The circuit takes two inputs: the pre-images and an additional scope parameter.
    signal input preimages[NUMBER_OF_INPUTS];
    signal input scope;

    assert (NUMBER_OF_INPUTS >= 1);
    assert (NUMBER_OF_INPUTS <= 16);

    // It applies the Poseidon hash function to the pre-image to produce a hash digest.
    signal output digest;
    digest <== Poseidon(NUMBER_OF_INPUTS)(preimages);

    // Dummy constraint to prevent compiler from optimizing it.
    signal dummySquare <== scope * scope;
}
