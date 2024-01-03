import { LeanIMT as JSLeanIMT } from "@zk-kit/imt"
import { expect } from "chai"
import { run } from "hardhat"
import { poseidon2 } from "poseidon-lite"
import { LeanIMT, LeanIMTTest } from "../typechain-types"

describe("LeanIMT", () => {
    const SNARK_SCALAR_FIELD = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617")
    let leanIMTTest: LeanIMTTest
    let leanIMT: LeanIMT
    let jsLeanIMT: JSLeanIMT

    beforeEach(async () => {
        const { library, contract } = await run("deploy:imt-test", { library: "LeanIMT", logs: false })

        leanIMTTest = contract
        leanIMT = library
        jsLeanIMT = new JSLeanIMT((a, b) => poseidon2([a, b]))
    })

    describe("# insert", () => {
        it("Should not insert a leaf if its value is > SNARK_SCALAR_FIELD", async () => {
            const transaction = leanIMTTest.insert(SNARK_SCALAR_FIELD)

            await expect(transaction).to.be.revertedWithCustomError(leanIMT, "LeafGreaterThanSnarkScalarField")
        })

        it("Should not insert a leaf if it is 0", async () => {
            const leaf = 0

            const transaction = leanIMTTest.insert(leaf)

            await expect(transaction).to.be.revertedWithCustomError(leanIMT, "LeafCannotBeZero")
        })

        it("Should insert a leaf", async () => {
            jsLeanIMT.insert(BigInt(1))

            await leanIMTTest.insert(1)

            const root = await leanIMTTest.root()

            expect(root).to.equal(jsLeanIMT.root)
        })

        it("Should not insert a leaf if it was already inserted before", async () => {
            await leanIMTTest.insert(1)

            const transaction = leanIMTTest.insert(1)

            await expect(transaction).to.be.revertedWithCustomError(leanIMT, "LeafAlreadyExists")
        })

        it("Should insert 10 leaves", async () => {
            for (let i = 0; i < 10; i += 1) {
                jsLeanIMT.insert(BigInt(i + 1))

                await leanIMTTest.insert(i + 1)

                const root = await leanIMTTest.root()

                expect(root).to.equal(jsLeanIMT.root)
            }
        })
    })

    describe("# insertMany", () => {
        it("Should not insert a leaf if its value is > SNARK_SCALAR_FIELD", async () => {
            const transaction = leanIMTTest.insertMany([SNARK_SCALAR_FIELD])

            await expect(transaction).to.be.revertedWithCustomError(leanIMT, "LeafGreaterThanSnarkScalarField")
        })

        it("Should not insert a leaf if it is 0", async () => {
            const leaf = 0

            const transaction = leanIMTTest.insertMany([leaf])

            await expect(transaction).to.be.revertedWithCustomError(leanIMT, "LeafCannotBeZero")
        })
        it("Should not insert a leaf if it was already inserted before", async () => {
            await leanIMTTest.insert(1)

            const transaction = leanIMTTest.insertMany([1])

            await expect(transaction).to.be.revertedWithCustomError(leanIMT, "LeafAlreadyExists")
        })
        it("Should insert a leaf", async () => {
            jsLeanIMT.insert(BigInt(1))

            await leanIMTTest.insertMany([1])

            const root = await leanIMTTest.root()

            expect(root).to.equal(jsLeanIMT.root)
        })
        it("Should insert 10 leaves", async () => {
            const elems: bigint[] = []
            for (let i = 0; i < 10; i += 1) {
                elems.push(BigInt(i + 1))
            }

            jsLeanIMT.insertMany(elems)
            await leanIMTTest.insertMany(elems)

            const root = await leanIMTTest.root()
            expect(root).to.equal(jsLeanIMT.root)
        })
        it("Should insert many leaves when the tree is not empty", async () => {
            jsLeanIMT.insert(BigInt(1))

            await leanIMTTest.insert(BigInt(1))

            const elems: bigint[] = []
            for (let i = 1; i < 10; i += 1) {
                elems.push(BigInt(i + 1))
            }

            jsLeanIMT.insertMany(elems)
            await leanIMTTest.insertMany(elems)

            const root = await leanIMTTest.root()
            expect(root).to.equal(jsLeanIMT.root)
        })
    })

    describe("# update", () => {
        it("Should not update a leaf if the leaf does not exist", async () => {
            const transaction = leanIMTTest.update(2, 1, [1, 2, 3, 4])

            await expect(transaction).to.be.revertedWithCustomError(leanIMT, "LeafDoesNotExist")
        })

        it("Should not update a leaf if its value is > SNARK_SCALAR_FIELD", async () => {
            const transaction = leanIMTTest.update(2, SNARK_SCALAR_FIELD, [1, 2, 3, 4])

            await expect(transaction).to.be.revertedWithCustomError(leanIMT, "LeafGreaterThanSnarkScalarField")
        })

        it("Should not update a leaf if there are no sibling nodes", async () => {
            await leanIMTTest.insert(1)

            jsLeanIMT.insert(BigInt(1))
            jsLeanIMT.update(0, BigInt(2))

            const { siblings } = jsLeanIMT.generateProof(0)

            const transaction = leanIMTTest.update(1, 2, siblings)

            await expect(transaction).to.be.revertedWithCustomError(leanIMT, "WrongSiblingNodes")
        })

        it("Should update a leaf", async () => {
            await leanIMTTest.insert(1)
            await leanIMTTest.insert(2)

            jsLeanIMT.insertMany([BigInt(1), BigInt(2)])
            jsLeanIMT.update(0, BigInt(3))

            const { siblings } = jsLeanIMT.generateProof(0)

            await leanIMTTest.update(1, 3, siblings)

            const root = await leanIMTTest.root()

            expect(root).to.equal(jsLeanIMT.root)
        })

        it("Should not update a leaf if the value of at least one sibling node is > SNARK_SCALAR_FIELD", async () => {
            await leanIMTTest.insert(1)
            await leanIMTTest.insert(2)

            jsLeanIMT.insertMany([BigInt(1), BigInt(2)])
            jsLeanIMT.update(0, BigInt(3))

            const { siblings } = jsLeanIMT.generateProof(0)

            siblings[0] = SNARK_SCALAR_FIELD

            const transaction = leanIMTTest.update(1, 3, siblings)

            await expect(transaction).to.be.revertedWithCustomError(leanIMT, "LeafGreaterThanSnarkScalarField")
        })

        it("Should not update a leaf if the siblings are wrong", async () => {
            await leanIMTTest.insert(1)
            await leanIMTTest.insert(2)

            jsLeanIMT.insertMany([BigInt(1), BigInt(2)])
            jsLeanIMT.update(0, BigInt(3))

            const { siblings } = jsLeanIMT.generateProof(0)

            siblings[0] = BigInt(3)

            const transaction = leanIMTTest.update(1, 3, siblings)

            await expect(transaction).to.be.revertedWithCustomError(leanIMT, "WrongSiblingNodes")
        })

        it("Should update 6 leaves", async () => {
            for (let i = 0; i < 6; i += 1) {
                jsLeanIMT.insert(BigInt(i + 1))

                await leanIMTTest.insert(i + 1)
            }

            for (let i = 0; i < 6; i += 1) {
                jsLeanIMT.update(i, BigInt(i + 7))

                const { siblings } = jsLeanIMT.generateProof(i)

                await leanIMTTest.update(i + 1, i + 7, siblings)

                const root = await leanIMTTest.root()

                expect(root).to.equal(jsLeanIMT.root)
            }
        })
    })

    describe("# remove", () => {
        it("Should remove a leaf", async () => {
            await leanIMTTest.insert(1)
            await leanIMTTest.insert(2)
            await leanIMTTest.insert(3)

            jsLeanIMT.insertMany([BigInt(1), BigInt(2), BigInt(3)])
            jsLeanIMT.update(2, BigInt(0))

            const { siblings } = jsLeanIMT.generateProof(2)

            await leanIMTTest.remove(3, siblings)

            const root = await leanIMTTest.root()

            expect(root).to.equal(jsLeanIMT.root)
        })

        it("Should remove 10 leaf", async () => {
            for (let i = 0; i < 10; i += 1) {
                jsLeanIMT.insert(BigInt(i + 1))

                await leanIMTTest.insert(i + 1)
            }

            for (let i = 0; i < 10; i += 1) {
                jsLeanIMT.update(i, BigInt(0))

                const { siblings } = jsLeanIMT.generateProof(i)

                await leanIMTTest.remove(i + 1, siblings)

                const root = await leanIMTTest.root()

                expect(root).to.equal(jsLeanIMT.root)
            }
        })
    })

    describe("# has", () => {
        it("Should return true because the node is in the tree", async () => {
            await leanIMTTest.insert(1)

            const hasLeaf = await leanIMTTest.has(1)

            expect(hasLeaf).to.equal(true)
        })
        it("Should return false because the node is not the tree", async () => {
            const hasLeaf = await leanIMTTest.has(2)

            expect(hasLeaf).to.equal(false)
        })
    })
    describe("# indexOf", () => {
        it("Should return the index of a leaf", async () => {
            await leanIMTTest.insert(1)

            const index = await leanIMTTest.indexOf(1)

            expect(index).to.equal(0)
        })
    })

    describe("# root", () => {
        it("Should return the tree root", async () => {
            jsLeanIMT.insert(BigInt(1))

            await leanIMTTest.insert(1)

            const root = await leanIMTTest.root()

            expect(root).to.equal(jsLeanIMT.root)
        })
    })
})
