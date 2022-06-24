import runIncrementalMerkleTree from "./incremental-merkle-tree"

const [benchmark] = process.argv.slice(2)

// If there is an argument with a specific benchmark to run, it will run only that
// benchmark, otherwise it will run all the benchmarks.
switch (benchmark) {
    case "incremental-merkle-tree":
        runIncrementalMerkleTree()
        break
    default:
        runIncrementalMerkleTree()
}
