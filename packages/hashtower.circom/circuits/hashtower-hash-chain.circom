pragma circom 2.1.4;

include "multiplexer.circom";
include "poseidon.circom";
include "comparators.circom";
include "gates.circom";

// Pick in[sel]
template PickOne(N) {
    signal input in[N];
    signal input sel;
    signal output out;

    component mux = Multiplexer(1, N);
    for (var i = 0; i < N; i++) { mux.inp[i][0] <== in[i]; }
    mux.sel <== sel;
    out <== mux.out[0];
}

// len 0:          0
// len 1        in[0]
// len 2:     H(in[0], in[1])
// len 3:   H(H(in[0], in[1]), in[2])
// len 4: H(H(H(in[0], in[1]), in[2]), in[3])
template HashChain(N) {
    signal input in[N];
    signal input len;  // [0...N]
    signal output out; // one of the N + 1 values

    signal outs[N + 1];
    outs[0] <== 0;     // empty
    outs[1] <== in[0]; // no hash
    for (var i = 2; i < N + 1; i++) {
        outs[i] <== Poseidon(2)([outs[i - 1], in[i - 1]]);
    }
    out <== PickOne(N + 1)(outs, len);
}

// RotateLeft(5)([0, 1, 2, 3, 4], 2) = [2, 3, 4, 0, 1]
template RotateLeft(N) {
    signal input in[N];
    signal input n; // 0 <= n < N
    signal output out[N];
    // row 0: rotate 0, row 1: rotate 1, ...
    component mux = Multiplexer(N, N);
    for (var i = 0; i < N; i++) {
        for (var j = 0; j < N; j++) {
            mux.inp[i][j] <== in[(i + j) % N];
        }
    }
    mux.sel <== n;
    out <== mux.out;
}

// Reverse(4)([0, 1, 2, 3]) = [3, 2, 1, 0]
template Reverse(N) {
    signal input in[N];
    signal output out[N];
    for (var i = 0; i < N; i++) {
        out[i] <== in[N - i - 1];
    }
}

// 0 => 0
// 1 => 1, 2 => 1, 3 => 1 ...
template IsNonZero() {
    signal input in;
    signal output out <== NOT()(IsZero()(in));
}

// if in != 1 then abort
template Must() {
    signal input in;
    in === 1;
}

// if a != b then abort
template MustEQ() {
    signal input a;
    signal input b;
    a === b;
}

// Include(3)([5, 2, 4], 4) = 1
// Include(3)([5, 2, 4], 6) = 0
template Include(N) {
    signal input in[N];
    signal input v;
    signal output out;

    signal prod[N];
    prod[0] <== in[0] - v;
    for (var i = 1; i < N; i++) {
        prod[i] <== prod[i - 1] * (in[i] - v);
    }
    out <== IsZero()(prod[N - 1]);
}

// LeadingOnes(4)(0) = [0, 0, 0, 0]
// LeadingOnes(4)(1) = [1, 0, 0, 0]
// LeadingOnes(4)(2) = [1, 1, 0, 0]
// LeadingOnes(4)(3) = [1, 1, 1, 0]
// LeadingOnes(4)(4) = [1, 1, 1, 1]
// LeadingOnes(4)(5) = fail
//
// Use this component to simulate dynamic loops.
template LeadingOnes(N) {
    signal input len; // len <= N
    signal output out[N]; // out[i] = i < len ? 1 : 0;

    var oneCount = 0;
    for (var i = 0; i < N; i++) {
        out[i] <-- i < len ? 1 : 0;
        (out[i] - 0) * (out[i] - 1) === 0; // out[i] must be 0 or 1
        oneCount += out[i];
    }
    oneCount === len; // it can hold only when len <= N

    signal from0to1[N - 1]; // from0to1[i] = (out[i] == 0) && (out[i + 1] == 1)
    var from0to1Count = 0;
    for (var i = 0; i < N - 1; i++) {
        from0to1[i] <== (1 - out[i]) * out[i + 1];
        from0to1Count += from0to1[i];
    }
    from0to1Count === 0; // no 0 to 1  =>  all 1 must be at the left most side
}
