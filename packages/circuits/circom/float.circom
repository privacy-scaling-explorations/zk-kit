pragma circom 2.1.5;

include "./bitify.circom";
include "./comparators.circom";
include "./mux1.circom";

// Template to determine the most significant bit (MSB) of an input number.
template MSB(n) {
    signal input in; 
    signal output out;

    // Convert the number to its bit representation.
    var n2b[n];
    n2b = Num2Bits(n)(in);

    // Assign the MSB to the output.
    out <== n2b[n-1];
}

// Template for bit-shifting a dividend and partial remainder.
template Shift(n) {
    signal input divident; // Dividend input.
    signal input rem; // Partial remainder input.

    signal output divident1; // Output for the shifted dividend.
    signal output rem1; // Output for the updated partial remainder.
    
    // Determine the MSB of the dividend.
    var lmsb;
    lmsb = MSB(n)(divident);

    // Shift the dividend.
    divident1 <== divident - lmsb * 2 ** (n - 1);

    // Update the partial remainder.
    rem1 <== rem * 2 + lmsb; 
}

// Template for performing integer division.
template IntegerDivision(n) {
    signal input a; // Dividend.
    signal input b; // Divisor.

    signal output c; // Quotient.

    // Ensure inputs are within the valid range.
    var lta;
    var ltb;
    
    lta = LessThan(252)([a, 2**n]);
    ltb = LessThan(252)([b, 2**n]);

    assert(lta == 1);
    assert(ltb == 1);

    // Ensure the divisor 'b' is not zero.
    var isz;

    isz = IsZero()(b);

    assert(isz == 0);

    // Prepare variables for division.
    var divident = a;
    var rem = 0;

    var bits[n];

    // Loop to perform division through bit-shifting and subtraction.
    for (var i = n - 1; i >= 0; i--) {
        // Shift 'divident' and 'rem' and determine if 'b' can be subtracted from the new 'rem'.
        var divident1;
        var rem1;

        (divident1, rem1) = Shift(i + 1)(divident, rem);

        // Determine if 'b' <= 'rem'.
        var canSubtract;

        canSubtract = LessEqThan(n)([b, rem1]);

        // Select 1 if 'b' can be subtracted (i.e., 'b' <= 'rem'), else select 0.
        var subtractBit;

        subtractBit = Mux1()([0, 1], canSubtract);

        // Subtract 'b' from 'rem' if possible, and set the corresponding bit in 'bits'.
        bits[i] = subtractBit;

        rem = rem1 - b * subtractBit;

        // Prepare 'divident' for the next iteration.
        divident = divident1;
    }

    // Convert the bit array representing the quotient into a number.
    c <== Bits2Num(n)(bits);
}

// Converts an integer to its floating-point representation by multiplying it with 10^W.
template ToFloat(W) {    
    // Assert W to ensure the result is within the range of 2^252.
    assert(W < 75);

    signal input in;

    signal output out;

    // Ensure the input multiplied by 10^W is less than 10^75 to prevent overflow.
    var lt;

    lt = LessEqThan(252)([in, 10 ** (75 - W)]);

    assert(lt == 1);
    
    // Convert the integer to floating-point by multiplying with 10^W.
    out <== in * (10**W);
}

// Performs division on floating-point numbers represented with W decimal digits.
template DivisionFromFloat(W, n) {    
    // Ensure W is within the valid range for floating-point representation.
    assert(W < 75); 
    // Ensure n, the bit-width of inputs, is within a valid range.
    assert(n < 252); 

    signal input a; // Numerator.
    signal input b; // Denominator.

    signal output c; // Quotient.
    
    // Ensure the numerator 'a' is within the range of valid floating-point numbers.
    var lt;

    lt = LessEqThan(252)([a, 10 ** (75 - W)]);

    assert(lt == 1);
    
    // Use IntegerDivision for division operation.
    c <== IntegerDivision(n)(a * (10 ** W), b);
}

// Performs division on integers by first converting them to floating-point representation.
template DivisionFromNormal(W, n) {
    signal input a; // Numerator.
    signal input b; // Denominator.

    signal output c; // Quotient.
        
    // Convert input to float and perform division.
    c <== DivisionFromFloat(W, n)(ToFloat(W)(a), ToFloat(W)(b));
}

// Performs multiplication on floating-point numbers and converts the result back to integer form.
template MultiplicationFromFloat(W, n) {
    // Ensure W is within the valid range for floating-point representation.
    assert(W < 75); 
    // Ensure n, the bit-width of inputs, is within a valid range.
    assert(n < 252); 
    // Ensure scaling factor is within the range of 'n' bits.
    assert(10**W < 2**n);     

    signal input a; // Multiplicand.
    signal input b; // Multiplier.

    signal output c; // Product.
    
    // Ensure both inputs 'a' and 'b' are within a valid range for multiplication.
    var lta;
    var ltb;

    lta = LessEqThan(252)([a, 2 ** 126]);
    ltb = LessEqThan(252)([b, 2 ** 126]);

    assert(lta == 1);
    assert(ltb == 1);
    
    // Perform integer division after multiplication to adjust the result back to W decimal digits.
    c <== IntegerDivision(n)(a * b, 10 ** W);
}

// Performs multiplication on integers by first converting them to floating-point representation.
template MultiplicationFromNormal(W, n) {
    signal input a; // Multiplicand.
    signal input b; // Multiplier.

    signal output c; // Product.

    
    // Convert input to float and perform multiplication.
    c <== MultiplicationFromFloat(W, n)(ToFloat(W)(a), ToFloat(W)(b));
}