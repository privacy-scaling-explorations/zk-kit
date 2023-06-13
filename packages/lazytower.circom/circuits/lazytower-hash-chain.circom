pragma circom 2.1.4;

include "circomlib/circuits/multiplexer.circom";
include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/gates.circom";
include "circomlib/circuits/bitify.circom";

// Pick in[sel]
//
// side effect: this also ensures that sel < N
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

    // The code tries to claim that if
    //     1. out[i] belongs to {0, 1} for all i in [0, N - 1]
    //     2. the value never goes from 0 to 1 when we scan from left to right
    // then the array will match the regex 1*0*  .
    //
    // The code further ensures that there should be len 1s .
    // So out[] could only be len 1s followed by N - len 0s .
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

function computeDataHeight(levelLengths, bitsPerLevel) {
    var h = 0;
    while (levelLengths > 0) {
        h++;
        levelLengths >>= bitsPerLevel;
    }
    return h;
}
function computeSingleLevelLength(levelLengths, lv, bitsPerLevel) {
    var mask = (1 << bitsPerLevel) - 1;
    return (levelLengths >> (lv * bitsPerLevel)) & mask;
}
template ComputeDataHeightAndLevelLengthArray(H, W, bitsPerLevel) {
    signal input levelLengths;
    signal output dataHeight;
    signal output levelLengthArray[H];

    // The code relies on the following statement:
    // If
    //     1. levelLengthArray[i] belongs to [1, W] for i in [0, dataHeight - 1], otherwise levelLengthArray[i] = 0
    //     2. dataHeight belongs to [0, H - 1]
    //     3. the W^i weighted sum of levelLengthArray = levelLengths
    //
    // , then levelLengthArray[] and dataHeight will be unique.
    //
    // A very rough analogy would be like in the 10-base system,
    // the only sequence matches with 492 could only be the length 3 [2, 9, 4] .

    // compute
    dataHeight <-- computeDataHeight(levelLengths, bitsPerLevel);
    for (var lv = 0; lv < H; lv++) {
        levelLengthArray[lv] <-- computeSingleLevelLength(levelLengths, lv, bitsPerLevel);
    }
    // constraints
    signal ones[H] <== LeadingOnes(H)(dataHeight);
    signal dummy[H][bitsPerLevel];
    var s = 0;
    for (var lv = 0; lv < H; lv++) {
        dummy[lv] <== Num2Bits(bitsPerLevel)(levelLengthArray[lv]);       // preventing LessEqThan from overflow
        Must()( LessEqThan(bitsPerLevel)([ levelLengthArray[lv], W ]) );  // ll < W
        MustEQ()( IsNonZero()( levelLengthArray[lv] ), ones[lv] );        // ll != 0 iff lv < dataHeight
        s += levelLengthArray[lv] * (2 ** (lv * bitsPerLevel));
    }
    levelLengths === s;
}

// W_BITS should match the one in the contract (which is 4)
template LazyTowerHashChain(H, W, W_BITS) {
    signal input levelLengths;
    signal input digestOfDigests;
    signal input topDownDigests[H];
    signal input rootLv;
    signal input rootLevel[W];
    signal input childrens[H - 1][W];
    signal input item;

    Must()(IsNonZero()(levelLengths));
    signal levelLengthArray[H];
    signal dataHeight;
    (dataHeight, levelLengthArray) <== ComputeDataHeightAndLevelLengthArray(H, W, W_BITS)(levelLengths);
    // rootLv < dataHeight  (where dataHeight < 2**8)
    Must()(LessThan(8)([rootLv, dataHeight]));
    // rootLevelLength = levelLengthArray[rootLv]
    // the side effect of PickOne enforces rootLv < H, so we don't have to prevent the overflow of LessThan above
    signal rootLevelLength <== PickOne(H)(levelLengthArray, rootLv);


    // the digest of topDownDigests matches digestOfDigests
    MustEQ()( HashChain(H)(topDownDigests, dataHeight), digestOfDigests );
    // now topDownDigests is good

    // the digest of rootLevel matches the one in topDownDigests
    signal rootLevelDigest <== PickOne(H)(topDownDigests, dataHeight - rootLv - 1);
    MustEQ()( HashChain(W)(rootLevel, rootLevelLength), rootLevelDigest );
    // now rootLevel is good

    // the root is in the prefix of the rootLevel
    // the root covers the item
    signal root <== CheckMerkleProofAndComputeRoot(H, W)(childrens, rootLv, item);
    Must()( IncludeInPrefix(W)(rootLevel, rootLevelLength, root) );
    // now item is good
}
