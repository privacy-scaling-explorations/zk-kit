pragma circom 2.0.0;

include "./bitify.circom";

// Template for safely comparing if one input is less than another,
// ensuring inputs are within a specified bit-length.
template SafeLessThan(n) {
    // Ensure the bit-length does not exceed 252 bits.
    assert(n <= 252);

    signal input in[2];
    signal output out;

    // Convert both inputs to their bit representations to ensure 
    // they fit within 'n' bits.
    var n2b1[n];
    n2b1 = Num2Bits(n)(in[0]);

    var n2b2[n];
    n2b2 = Num2Bits(n)(in[1]);

    // Additional conversion to handle arithmetic operation and capture the comparison result.
    var n2b[n+1];
    n2b = Num2Bits(n + 1)(in[0] + (1<<n) - in[1]);

    // Determine if in[0] is less than in[1] based on the most significant bit.
    out <== 1 - n2b[n];
}

// Template to check if one input is less than or equal to another.
template SafeLessEqThan(n) {
    signal input in[2];
    signal output out;

    // Use SafeLessThan to determine if in[0] is less than in[1] + 1.
    out <== SafeLessThan(n)([in[0], in[1] + 1]);
}

// Template for safely comparing if one input is greater than another.
template SafeGreaterThan(n) {
    // Two inputs to compare.
    signal input in[2];
    // Output signal indicating comparison result.
    signal output out;

    // Invert the inputs for SafeLessThan to check if in[1] is less than in[0].
    out <== SafeLessThan(n)([in[1], in[0]]);
}

// Template to check if one input is greater than or equal to another.
template SafeGreaterEqThan(n) {
    // Two inputs to compare.
    signal input in[2];
    // Output signal indicating comparison result.
    signal output out;

    // Invert the inputs and adjust for equality in SafeLessThan to 
    // check if in[1] is less than or equal to in[0].
    out <== SafeLessThan(n)([in[1], in[0] + 1]);
}
