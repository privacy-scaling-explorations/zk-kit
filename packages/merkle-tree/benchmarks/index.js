// const b = require("benny");
// const { poseidon } = require("circomlibjs");
// const { IncrementalMerkleTree } = require("../dist/types")
// const Tree = require("incrementalquintree/build/IncrementalQuinTree")

// const tree = new IncrementalMerkleTree(poseidon, 20, BigInt(0), 2)
// const old = new Tree.IncrementalQuinTree(20, BigInt(0), 2, poseidon)

// const numberOfLeaves = 2 ** 10;

// b.suite(
//   'incremental merkle tree benchmarks',

//   b.add('generate proof for nary binary tree', () => {
//     for (let i = 0; i < numberOfLeaves; i+=1) {
//       tree.insert(BigInt(i + 1))
//     }

//     for (let i = 0; i < numberOfLeaves; i += 1) {
//       tree.createProof(i)
//     }
//   }),

//   b.add('generate proof for old binary tree', () => {
//     for (let i = 0; i < numberOfLeaves; i+=1) {
//       old.insert(BigInt(i + 1))
//     }

//     for (let i = 0; i < numberOfLeaves; i += 1) {
//       old.genMerklePath(i)
//     }
//   }),

//   b.cycle(),
//   b.complete(),
//   b.save({ file: 'reduce', version: '1.0.0', details: true }),
//   b.save({ file: 'reduce', format: 'chart.html', details: true }),
// )
