pragma circom 2.1.5;

include "../templates/merkle-root.circom";

component main {public [depth]} = MerkleRoot(16);
