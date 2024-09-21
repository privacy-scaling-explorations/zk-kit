import run from "./benchmark-merkle-trees"

const treeDepthSamples: number[] = [3, 7, 10]
let numberOfLeaves: number
treeDepthSamples.forEach((treeDepth) => {
    numberOfLeaves = 2 ** treeDepth
    run(treeDepth, numberOfLeaves)
})
