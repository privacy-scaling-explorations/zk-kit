import { expect } from "chai"
import { run } from "hardhat"
import { poseidon2 } from "poseidon-lite"
import { IMT } from "@zk-kit/imt"
import { LazyIMT, LazyIMTTest } from "../typechain-types"

const random = () => poseidon2([Math.floor(Math.random() * 2 ** 40), 0])

/* eslint-disable jest/valid-expect */
describe("LazyIMT", () => {
    let lazyIMTTest: LazyIMTTest
    let lazyIMT: LazyIMT

    beforeEach(async () => {
        const { library, contract } = await run("deploy:imt-test", { library: "LazyIMT", logs: false })

        lazyIMTTest = contract
        lazyIMT = library
    })

    it("Should check zero values", async () => {
        expect("0").to.equal((await lazyIMT.defaultZero(0)).toString())

        let hash = poseidon2([BigInt(0), BigInt(0)])

        for (let x = 1; x < 33; x += 1) {
            const v = await lazyIMT.defaultZero(x)
            expect(v.toString()).to.equal(hash.toString())
            hash = poseidon2([hash, hash])
        }

        await expect(lazyIMT.defaultZero(34)).to.be.revertedWith("LazyIMT: defaultZero bad index")
    })

    for (let x = 0; x < 32; x += 1) {
        it(`Should initialize tree with depth ${x}`, async () => {
            {
                const treeData = await lazyIMTTest.data()

                expect(treeData.maxIndex).to.equal(0)
                expect(treeData.numberOfLeaves).to.equal(0)
            }

            await lazyIMTTest.init(x)

            {
                const treeData = await lazyIMTTest.data()

                expect(treeData.maxIndex).to.equal(2 ** x - 1)
                expect(treeData.numberOfLeaves).to.equal(0)
            }
        })
    }

    // insertion tests

    it("Should fail to init large tree", async () => {
        const treeData = await lazyIMTTest.data()

        expect(treeData.maxIndex).to.equal(0)
        expect(treeData.numberOfLeaves).to.equal(0)

        await expect(lazyIMTTest.init(33)).to.be.revertedWith("LazyIMT: Tree too large")
    })

    for (let depth = 1; depth < 6; depth += 1) {
        it(`Should insert leaves in tree with depth ${depth}`, async () => {
            await lazyIMTTest.init(10)

            // empty root should be H(0, 0)
            expect(await lazyIMTTest.root()).to.equal(poseidon2([BigInt(0), BigInt(0)]))

            const elements = []

            for (let x = 0; x < 2 ** depth - 1; x += 1) {
                const e = random()

                elements.push(e)

                // construct the tree
                const targetDepth = Math.max(1, Math.ceil(Math.log2(elements.length)))
                const merkleTree = new IMT(poseidon2, targetDepth, BigInt(0))

                for (const _e of elements) {
                    merkleTree.insert(_e)
                }

                await lazyIMTTest.insert(e)

                const root = await lazyIMTTest.root()

                expect(root.toString()).to.equal(merkleTree.root.toString())

                const treeData = await lazyIMTTest.data()

                expect(treeData.numberOfLeaves).to.equal(elements.length)
            }
        })
    }

    it("Should fail to insert too many leaves", async () => {
        const depth = 5

        await lazyIMTTest.init(depth)

        for (let x = 0; x < 2 ** depth - 1; x += 1) {
            await lazyIMTTest.insert(random())
        }

        await expect(lazyIMTTest.insert(random())).to.be.revertedWith("LazyIMT: tree is full")
    })

    it("Should fail to insert leaf outside of field", async () => {
        const depth = 5

        await lazyIMTTest.init(depth)

        const F = await lazyIMT.SNARK_SCALAR_FIELD()

        await expect(lazyIMTTest.insert(F)).to.be.revertedWith("LazyIMT: leaf must be < SNARK_SCALAR_FIELD")
    })

    // update tests

    for (let depth = 1; depth < 5; depth += 1) {
        it(`Should update leaves in tree with depth ${depth}`, async () => {
            await lazyIMTTest.init(depth)

            const elements = []

            // runs in ~N^N
            for (let x = 0; x < 2 ** depth - 1; x += 1) {
                const e = random()

                elements.push(e)

                // construct the tree
                const targetDepth = Math.max(1, Math.ceil(Math.log2(elements.length)))

                {
                    const merkleTree = new IMT(poseidon2, targetDepth, BigInt(0))

                    for (const _e of elements) {
                        merkleTree.insert(_e)
                    }

                    await lazyIMTTest.insert(e)

                    const root = await lazyIMTTest.root()

                    expect(root.toString()).to.equal(merkleTree.root.toString())

                    const treeData = await lazyIMTTest.data()

                    expect(treeData.numberOfLeaves).to.equal(elements.length)
                }

                for (let y = 0; y < x; y += 1) {
                    const newE = random()

                    elements.splice(y, 1, newE)

                    await lazyIMTTest.update(newE, y)

                    const merkleTree = new IMT(poseidon2, targetDepth, BigInt(0))

                    for (const _e of elements) {
                        merkleTree.insert(_e)
                    }

                    const root = await lazyIMTTest.root()

                    expect(root.toString()).to.equal(merkleTree.root.toString())

                    const treeData = await lazyIMTTest.data()

                    expect(treeData.numberOfLeaves).to.equal(elements.length)
                }
            }
        })
    }

    it("Should fail to update invalid leaf index", async () => {
        const depth = 4

        await lazyIMTTest.init(depth)

        for (let x = 0; x < 10; x += 1) {
            await lazyIMTTest.insert(random())
        }

        await expect(lazyIMTTest.update(random(), 10)).to.be.revertedWith("LazyIMT: leaf must exist")
    })

    it("Should fail to update with invalid leaf value", async () => {
        const depth = 4

        await lazyIMTTest.init(depth)

        for (let x = 0; x < 3; x += 1) {
            await lazyIMTTest.insert(random())
        }

        const F = await lazyIMT.SNARK_SCALAR_FIELD()

        await expect(lazyIMTTest.update(F, 0)).to.be.revertedWith("LazyIMT: leaf must be < SNARK_SCALAR_FIELD")
    })

    it("Should reset and reuse tree", async () => {
        const depth = 4

        await lazyIMTTest.init(10)

        {
            const data = await lazyIMTTest.data()

            expect(data.numberOfLeaves).to.equal(0)
        }

        for (let i = 0; i < 3; i += 1) {
            const elements = []

            for (let x = 0; x < 2 ** depth - 1; x += 1) {
                const e = random()

                elements.push(e)

                // construct the tree
                const targetDepth = Math.max(1, Math.ceil(Math.log2(elements.length)))
                const merkleTree = new IMT(poseidon2, targetDepth, BigInt(0))

                for (const _e of elements) {
                    merkleTree.insert(_e)
                }

                await lazyIMTTest.insert(e)

                const root = await lazyIMTTest.root()

                expect(root.toString()).to.equal(merkleTree.root.toString())

                const treeData = await lazyIMTTest.data()

                expect(treeData.numberOfLeaves).to.equal(elements.length)
            }

            await lazyIMTTest.reset()

            {
                const data = await lazyIMTTest.data()
                expect(data.numberOfLeaves).to.equal(0)
            }
        }
    })
})
