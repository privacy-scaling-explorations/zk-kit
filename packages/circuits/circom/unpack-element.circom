pragma circom 2.1.5;

include "./bitify.circom";

// Template to convert a single field element into multiple 50-bit elements.
template UnpackElement(n) {
    // A field element.
    signal input in;
    // An array of n elements, each 50 bits long.
    signal output out[n];

    // Ensure the number of outputs is more than 1 and up to 5.
    assert(n > 1 && n <= 5);

    // Convert the input signal to its bit representation.
    var bits[254]; 
    bits = Num2Bits_strict()(in);

    for (var i = 0; i < n; i++) {
        var tempBits[50];

        // Select and assign the appropriate 50-bit segment of the input's bit representation.
        for (var j = 0; j < 50; j++) {
            // Calculate the bit's index, considering the output element's position.
            tempBits[j] = bits[((n - i - 1) * 50) + j];
        }

        // Assign the numerical value of the 50-bit segment to the output signal.
        out[i] <== Bits2Num(50)(tempBits);
    }
}
