import { expect } from "chai"
import { Contract } from "ethers"
import { ethers, run } from "hardhat"
import { createTree } from "./utils"

/* eslint-disable jest/valid-expect */
describe("QuinTreeTest", () => {
  let contract: Contract

  const treeId = ethers.utils.formatBytes32String("treeId")
  const leaf = BigInt(1)
  const depth = 16

  before(async () => {
    contract = await run("deploy:quin-tree-test", { logs: false })
  })

  it("Should not create a tree with a depth > 32", async () => {
    const transaction = contract.createTree(treeId, 33)

    await expect(transaction).to.be.revertedWith("IncrementalQuinTree: tree depth must be between 1 and 32")
  })

  it("Should create a tree", async () => {
    const transaction = contract.createTree(treeId, depth)

    await expect(transaction).to.emit(contract, "TreeCreated").withArgs(treeId, depth)
  })

  it("Should not create a tree with an existing id", async () => {
    const transaction = contract.createTree(treeId, depth)

    await expect(transaction).to.be.revertedWith("QuinTreeTest: tree already exists")
  })

  it("Should not insert a leaf if the tree does not exist", async () => {
    const treeId = ethers.utils.formatBytes32String("treeId2")

    const transaction = contract.insertLeaf(treeId, leaf)

    await expect(transaction).to.be.revertedWith("QuinTreeTest: tree does not exist")
  })

  it("Should not insert a leaf if its value is > SNARK_SCALAR_FIELD", async () => {
    const leaf = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495618")

    const transaction = contract.insertLeaf(treeId, leaf)

    await expect(transaction).to.be.revertedWith("IncrementalQuinTree: leaf must be < SNARK_SCALAR_FIELD")
  })

  it("Should insert a leaf in a tree", async () => {
    const tree = createTree(depth, 1, 5)
    const transaction = contract.insertLeaf(treeId, leaf)

    await expect(transaction).to.emit(contract, "LeafInserted").withArgs(treeId, leaf, tree.root)
  })

  it("Should insert 6 leaves in a tree", async () => {
    const treeId = ethers.utils.formatBytes32String("tree2")
    await contract.createTree(treeId, depth)
    const tree = createTree(depth, 0, 5)

    for (let i = 0; i < 6; i += 1) {
      tree.insert(BigInt(i + 1))
      const transaction = contract.insertLeaf(treeId, BigInt(i + 1))

      await expect(transaction)
        .to.emit(contract, "LeafInserted")
        .withArgs(treeId, BigInt(i + 1), tree.root)
    }
  })

  it("Should not insert a leaf if the tree is full", async () => {
    const treeId = ethers.utils.formatBytes32String("tinyTree")

    await contract.createTree(treeId, 1)
    await contract.insertLeaf(treeId, leaf)
    await contract.insertLeaf(treeId, leaf)
    await contract.insertLeaf(treeId, leaf)
    await contract.insertLeaf(treeId, leaf)
    await contract.insertLeaf(treeId, leaf)

    const transaction = contract.insertLeaf(treeId, leaf)

    await expect(transaction).to.be.revertedWith("IncrementalQuinTree: tree is full")
  })

  it("Should not remove a leaf if the tree does not exist", async () => {
    const treeId = ethers.utils.formatBytes32String("none")

    const transaction = contract.removeLeaf(treeId, leaf, [[0, 1, 2, 3]], [0])

    await expect(transaction).to.be.revertedWith("QuinTreeTest: tree does not exist")
  })

  it("Should not remove a leaf if its value is > SNARK_SCALAR_FIELD", async () => {
    const leaf = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495618")

    const transaction = contract.removeLeaf(treeId, leaf, [[0, 1, 2, 3]], [0])

    await expect(transaction).to.be.revertedWith("IncrementalQuinTree: leaf must be < SNARK_SCALAR_FIELD")
  })

  it("Should remove a leaf", async () => {
    const treeId = ethers.utils.formatBytes32String("hello")
    const tree = createTree(depth, 3, 5)

    tree.delete(0)

    await contract.createTree(treeId, depth)
    await contract.insertLeaf(treeId, BigInt(1))
    await contract.insertLeaf(treeId, BigInt(2))
    await contract.insertLeaf(treeId, BigInt(3))

    const { siblings, pathIndices, root } = tree.createProof(0)

    const transaction = contract.removeLeaf(treeId, BigInt(1), siblings, pathIndices)

    await expect(transaction).to.emit(contract, "LeafRemoved").withArgs(treeId, BigInt(1), root)
  })

  it("Should remove another leaf", async () => {
    const treeId = ethers.utils.formatBytes32String("hello")
    const tree = createTree(depth, 3, 5)

    tree.delete(0)
    tree.delete(1)

    const { siblings, pathIndices, root } = tree.createProof(1)

    const transaction = contract.removeLeaf(treeId, BigInt(2), siblings, pathIndices)

    await expect(transaction).to.emit(contract, "LeafRemoved").withArgs(treeId, BigInt(2), root)
  })

  it("Should not remove a leaf that does not exist", async () => {
    const treeId = ethers.utils.formatBytes32String("hello")
    const tree = createTree(depth, 3, 5)

    tree.delete(0)
    tree.delete(1)

    const { siblings, pathIndices } = tree.createProof(0)

    const transaction = contract.removeLeaf(treeId, BigInt(4), siblings, pathIndices)

    await expect(transaction).to.be.revertedWith("IncrementalQuinTree: leaf is not part of the tree")
  })

  it("Should insert a leaf in a tree after a removal", async () => {
    const treeId = ethers.utils.formatBytes32String("hello")
    const tree = createTree(depth, 4, 5)

    tree.delete(0)
    tree.delete(1)

    const transaction = contract.insertLeaf(treeId, BigInt(4))

    await expect(transaction).to.emit(contract, "LeafInserted").withArgs(treeId, BigInt(4), tree.root)
  })

  it("Should insert 4 leaves and remove them all", async () => {
    const treeId = ethers.utils.formatBytes32String("complex")
    const tree = createTree(depth, 4, 5)

    await contract.createTree(treeId, depth)

    for (let i = 0; i < 4; i += 1) {
      await contract.insertLeaf(treeId, BigInt(i + 1))
    }

    for (let i = 0; i < 4; i += 1) {
      tree.delete(i)

      const { siblings, pathIndices } = tree.createProof(i)

      await contract.removeLeaf(treeId, BigInt(i + 1), siblings, pathIndices)
    }

    const { root } = await contract.trees(treeId)

    expect(root).to.equal(tree.root)
  })
})
