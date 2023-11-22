pragma circom 2.1.5;

include "../templates/binary-merkle-root.circom";

component main {public [depth]} = BinaryMerkleRoot(16);
