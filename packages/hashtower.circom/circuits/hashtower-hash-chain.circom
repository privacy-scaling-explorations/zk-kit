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

// Is v being included in in[]?
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

// Is v being included in the first prefixLen elements of in[]?
template IncludeInPrefix(N) { // complexity 5N
    signal input in[N];
    signal input prefixLen; // 0 <= prefixLen <= N
    signal input v;
    signal output out; // 1 iff v is in  in[0 .. prefixLen - 1]

    signal leadingOnes[N] <== LeadingOnes(N)(prefixLen);
    signal isGood[N];
    var goodCount = 0;
    for (var i = 0; i < N; i++) {
        isGood[i] <== AND()(IsEqual()([in[i], v]), leadingOnes[i]);
        goodCount += isGood[i];
    }
    out <== IsNonZero()(goodCount);
}

// Compuates a Merkle root at rootLv made from childrens[0 .. rootLv - 1][] and leaf.
//
// Each childrens[i] must include the digest of childrens[i - 1] for i = 1 ... rootLv - 1
// childrens[0] must include leaf.
//
// root = digest of childrens[rootLv - 1] if rootLv > 0
// root = leaf if rootLv == 0
template CheckMerkleProofAndComputeRoot(H, W) {
    signal input childrens[H - 1][W]; // we only check childrens[] *below* rootLv
    signal input rootLv; // 0 <= rootLv <= H - 1  (otherwise will be rejected)
    signal input leaf;
    signal output root;

    // TBI: to be included
    //
    // childrens[lv] must include TBI[lv]  for all lv in [0 ... rootLv - 1]
    //
    // TBI[0] = leaf
    // TBI[lv] = digest of children[lv - 1]  for all lv in [1 ... rootLv]
    // TBI[rootLv] is the root
    //
    // For rootLv = 3, H = 5:                                                         mustInclude[]
    //                                  TBI[4]                                        0
    // rootLv =>                        TBI[3] <== digest of childrens[2] ==> *root*  0
    //           childrens[2]  include  TBI[2] <== digest of childrens[1]             1
    //           childrens[1]  include  TBI[1] <== digest of childrens[0]             1
    //           childrens[0]  include  TBI[0] <== *leaf*                             1
    signal TBI[H];
    TBI[0] <== leaf;

    // LeadingOnes() will also help us enforce rootLv <= H - 1
    signal mustInclude[H - 1] <== LeadingOnes(H - 1)(rootLv);
    for (var lv = 0; lv < H - 1; lv++) {
        // Either  childrens[lv] include TBI[lv]   or   !mustInclude[lv]
        Must()(OR()(
            Include(W)( childrens[lv], TBI[lv] ),
            NOT()( mustInclude[lv] )
        ));
        TBI[lv + 1] <== HashChain(W)(childrens[lv], W);
    }
    root <== PickOne(H)(TBI, rootLv); // root = TBI[rootLv]
}
