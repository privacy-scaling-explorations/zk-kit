import run from "./benchmark-merkle-trees"

// Benchmark with 8 leafs
let treeDepth = 3
let numberOfLeaves = 2 ** treeDepth
run(treeDepth, numberOfLeaves)

// Benchmark with 128 leafs
treeDepth = 7
numberOfLeaves = 2 ** treeDepth
run(treeDepth, numberOfLeaves)

// Benchmark with 1024 leafs
treeDepth = 10
numberOfLeaves = 2 ** treeDepth
run(treeDepth, numberOfLeaves)
