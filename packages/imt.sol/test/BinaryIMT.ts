import { IMT } from "@zk-kit/imt"
import { expect } from "chai"
import { poseidon } from "circomlibjs"
import { run } from "hardhat"
import { BinaryIMT, BinaryIMTTest } from "../typechain-types"
import { createTree } from "./utils"

/* eslint-disable jest/valid-expect */
describe("BinaryIMT", () => {
    let binaryIMTTest: BinaryIMTTest
    let binaryIMT: BinaryIMT
    let imt: IMT

    beforeEach(async () => {
        const { library, contract } = await run("deploy:imt-test", { library: "BinaryIMT", logs: false })

        binaryIMTTest = contract
        binaryIMT = library
        imt = createTree(16)
    })

    it("Should not create a tree with a depth > 32", async () => {
        const transaction = binaryIMTTest.init(33)

        await expect(transaction).to.be.revertedWith("BinaryIMT: tree depth must be between 1 and 32")
    })

    it("Should create a tree", async () => {
        await binaryIMTTest.init(imt.depth)

        const { depth } = await binaryIMTTest.data()

        expect(depth).to.equal(imt.depth)
    })

    it("Should create a tree with default zeroes", async () => {
        await binaryIMTTest.initWithDefaultZeroes(imt.depth)

        const { depth, useDefaultZeroes } = await binaryIMTTest.data()

        expect(depth).to.equal(imt.depth)
        expect(useDefaultZeroes).to.equal(true)
    })

    it("Should not insert a leaf if its value is > SNARK_SCALAR_FIELD", async () => {
        const leaf = await binaryIMT.SNARK_SCALAR_FIELD()

        const transaction = binaryIMTTest.insert(leaf)

        await expect(transaction).to.be.revertedWith("BinaryIMT: leaf must be < SNARK_SCALAR_FIELD")
    })

    it("Should insert a leaf in a tree", async () => {
        await binaryIMTTest.init(imt.depth)

        imt.insert(1)

        await binaryIMTTest.insert(1)

        const { root } = await binaryIMTTest.data()

        expect(root).to.equal(imt.root)
    })

    it("Should insert a leaf in a tree with default zeroes", async () => {
        await binaryIMTTest.init(imt.depth)

        imt.insert(1)

        await binaryIMTTest.insert(1)

        const { root } = await binaryIMTTest.data()

        expect(root).to.equal(imt.root)
    })

    it("Should insert 4 leaves in a tree", async () => {
        await binaryIMTTest.init(imt.depth)

        for (let i = 0; i < 4; i += 1) {
            const leaf = i + 1

            imt.insert(leaf)
            await binaryIMTTest.insert(leaf)

            const { root } = await binaryIMTTest.data()

            expect(root).to.equal(imt.root)
        }
    })

    it("Should insert 4 leaves in a default zeroes tree", async () => {
        const imt = new IMT(poseidon, 32, 0)

        await binaryIMTTest.initWithDefaultZeroes(imt.depth)

        for (let x = 0; x < 4; x += 1) {
            const leaf = (x + 10) ** 2

            imt.insert(leaf)
            await binaryIMTTest.insert(leaf)

            const { root } = await binaryIMTTest.data()

            expect(root).to.equal(imt.root)
        }
    })

    it("Should not insert a leaf if the tree is full", async () => {
        await binaryIMTTest.init(1)
        await binaryIMTTest.insert(1)
        await binaryIMTTest.insert(2)

        const transaction = binaryIMTTest.insert(3)

        await expect(transaction).to.be.revertedWith("BinaryIMT: tree is full")
    })

    it("Should not update a leaf if the new value is the same as the old one", async () => {
        await binaryIMTTest.init(imt.depth)
        await binaryIMTTest.insert(1)

        const transaction = binaryIMTTest.update(1, 1, [0, 1], [0, 1])

        await expect(transaction).to.be.revertedWith("BinaryIMT: new leaf cannot be the same as the old one")
    })

    it("Should not update a leaf if its new value is > SNARK_SCALAR_FIELD", async () => {
        await binaryIMTTest.init(imt.depth)
        await binaryIMTTest.insert(1)

        const newLeaf = await binaryIMT.SNARK_SCALAR_FIELD()

        const transaction = binaryIMTTest.update(1, newLeaf, [0, 1], [0, 1])

        await expect(transaction).to.be.revertedWith("BinaryIMT: new leaf must be < SNARK_SCALAR_FIELD")
    })

    it("Should not update a leaf if its original value is > SNARK_SCALAR_FIELD", async () => {
        await binaryIMTTest.init(imt.depth)
        await binaryIMTTest.insert(1)

        const oldLeaf = await binaryIMT.SNARK_SCALAR_FIELD()

        const transaction = binaryIMTTest.update(oldLeaf, 2, [0, 1], [0, 1])

        await expect(transaction).to.be.revertedWith("BinaryIMT: leaf must be < SNARK_SCALAR_FIELD")
    })

    it("Should not update a leaf if the path indices are wrong", async () => {
        await binaryIMTTest.init(imt.depth)
        await binaryIMTTest.insert(1)

        imt.insert(1)
        imt.update(0, 2)

        const { pathIndices, siblings } = imt.createProof(0)

        pathIndices[0] = 2

        const transaction = binaryIMTTest.update(
            1,
            2,
            siblings.map((s) => s[0]),
            pathIndices
        )

        await expect(transaction).to.be.revertedWith("BinaryIMT: path index is neither 0 nor 1")
    })

    it("Should not update a leaf if the old leaf is wrong", async () => {
        await binaryIMTTest.init(imt.depth)
        await binaryIMTTest.insert(1)

        imt.insert(1)
        imt.update(0, 2)

        const { pathIndices, siblings } = imt.createProof(0)

        const transaction = binaryIMTTest.update(
            2,
            3,
            siblings.map((s) => s[0]),
            pathIndices
        )

        await expect(transaction).to.be.revertedWith("BinaryIMT: leaf is not part of the tree")
    })

    it("Should update a leaf", async () => {
        await binaryIMTTest.init(imt.depth)
        await binaryIMTTest.insert(1)

        imt.insert(1)
        imt.update(0, 2)

        const { pathIndices, siblings } = imt.createProof(0)

        await binaryIMTTest.update(
            1,
            2,
            siblings.map((s) => s[0]),
            pathIndices
        )

        const { root } = await binaryIMTTest.data()

        expect(root).to.equal(imt.root)
    })

    it("Should not remove a leaf if its value is > SNARK_SCALAR_FIELD", async () => {
        const leaf = await binaryIMT.SNARK_SCALAR_FIELD()

        const transaction = binaryIMTTest.remove(leaf, [0, 1], [0, 1])

        await expect(transaction).to.be.revertedWith("BinaryIMT: leaf must be < SNARK_SCALAR_FIELD")
    })

    it("Should not remove a leaf that does not exist", async () => {
        await binaryIMTTest.init(imt.depth)
        await binaryIMTTest.insert(1)

        imt.insert(1)
        imt.delete(0)

        const { siblings, pathIndices } = imt.createProof(0)

        const transaction = binaryIMTTest.remove(
            2,
            siblings.map((s) => s[0]),
            pathIndices
        )

        await expect(transaction).to.be.revertedWith("BinaryIMT: leaf is not part of the tree")
    })

    it("Should remove a leaf", async () => {
        await binaryIMTTest.init(imt.depth)
        await binaryIMTTest.insert(1)

        imt.insert(1)
        imt.delete(0)

        const { pathIndices, siblings } = imt.createProof(0)

        await binaryIMTTest.remove(
            1,
            siblings.map((s) => s[0]),
            pathIndices
        )

        const { root } = await binaryIMTTest.data()

        expect(root).to.equal(imt.root)
    })

    it("Should remove a leaf in a tree with default zeroes", async () => {
        await binaryIMTTest.initWithDefaultZeroes(imt.depth)
        await binaryIMTTest.insert(1)

        imt.insert(1)
        imt.delete(0)

        const { siblings, pathIndices } = imt.createProof(0)

        await binaryIMTTest.remove(
            1,
            siblings.map((s) => s[0]),
            pathIndices
        )

        const { root } = await binaryIMTTest.data()

        expect(root).to.equal(imt.root)
    })

    it("Should not update a leaf that hasn't been inserted yet", async () => {
        binaryIMTTest.init(imt.depth)

        for (let i = 0; i < 4; i += 1) {
            const leaf = i + 1

            imt.insert(leaf)
            await binaryIMTTest.insert(leaf)
        }

        // We're going to try to update leaf 7, despite there only being 4 leaves in the tree.
        const leaf = 42069

        // Note that we can insert zeros into the js library tree and the root won't change!
        // that's because we use the zeros optimization to calculate the roots efficiently.
        // technically speaking, there isn't an "empty" tree, there is only a tree that is
        // entirely full of the zero value at every index. Therefore inserting the zero value
        // at any point into an incremental merkle tree doesn't change it's root, because
        // that is already the data the root was calculated from previously. In principle,
        // we can update any leaf that hasn't been inserted yet using this method.
        const rootBeforeZeros = imt.root

        imt.insert(0)
        imt.insert(0)
        imt.insert(0)

        // The root doesn't change because the tree started full with 0s!
        expect(imt.root).to.be.equal(rootBeforeZeros)

        // Now we can make a merkle proof of zero being included at the uninitialized index.
        const { pathIndices, siblings } = imt.createProof(6)

        const transaction = binaryIMTTest.update(
            0,
            leaf,
            siblings.map((s) => s[0]),
            pathIndices
        )

        await expect(transaction).to.be.revertedWith("BinaryIMT: leaf index out of range")
    })

    it("Should insert a leaf in a tree after a removal", async () => {
        await binaryIMTTest.init(imt.depth)
        await binaryIMTTest.insert(1)

        imt.insert(1)
        imt.delete(0)

        const { pathIndices, siblings } = imt.createProof(0)

        await binaryIMTTest.remove(
            1,
            siblings.map((s) => s[0]),
            pathIndices
        )

        imt.insert(2)
        await binaryIMTTest.insert(2)

        const { root } = await binaryIMTTest.data()

        expect(root).to.equal(imt.root)
    })

    it("Should insert 4 leaves and remove them all", async () => {
        await binaryIMTTest.init(imt.depth)

        for (let i = 0; i < 4; i += 1) {
            const leaf = i + 1

            imt.insert(leaf)
            await binaryIMTTest.insert(leaf)
        }

        for (let i = 0; i < 4; i += 1) {
            imt.delete(i)

            const { siblings, pathIndices } = imt.createProof(i)

            await binaryIMTTest.remove(
                i + 1,
                siblings.map((s) => s[0]),
                pathIndices
            )
        }

        const { root } = await binaryIMTTest.data()

        expect(root).to.equal(imt.root)
    })
})
