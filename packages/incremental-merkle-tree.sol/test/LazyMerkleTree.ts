import { expect } from "chai"
import { run } from "hardhat"
import { poseidon2 } from "poseidon-lite"
import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree"

const random = () => poseidon2([Math.floor(Math.random() * 2 ** 40), 0])

/* eslint-disable jest/valid-expect */
describe("LazyMerkleTree", function () {
    this.timeout(100000)

    it("should check zero values", async () => {
        const { lazyMerkleTree } = await run("deploy:lmt-test", { logs: false })
        expect("0").to.equal((await lazyMerkleTree.defaultZero(0)).toString())
        let hash = poseidon2([0n, 0n])
        for (let x = 1; x < 33; x += 1) {
            const v = await lazyMerkleTree.defaultZero(x)
            expect(v.toString()).to.equal(hash.toString())
            hash = poseidon2([hash, hash])
        }
        await expect(lazyMerkleTree.defaultZero(34)).to.be.revertedWith("LazyMerkleTree: defaultZero bad index")
    })

    for (let x = 0; x < 32; x += 1) {
        it(`should initialize tree with depth ${x}`, async () => {
            const { contract } = await run("deploy:lmt-test", { logs: false })
            {
                const treeData = await contract.data()
                expect(treeData.maxIndex).to.equal(0)
                expect(treeData.numberOfLeaves).to.equal(0)
            }
            await contract.init(x)
            {
                const treeData = await contract.data()
                expect(treeData.maxIndex).to.equal(2 ** x - 1)
                expect(treeData.numberOfLeaves).to.equal(0)
            }
        })
    }

    // insertion tests

    it("should fail to init large tree", async () => {
        const { contract } = await run("deploy:lmt-test", { logs: false })
        {
            const treeData = await contract.data()
            expect(treeData.maxIndex).to.equal(0)
            expect(treeData.numberOfLeaves).to.equal(0)
        }
        await expect(contract.init(33)).to.be.revertedWith("LazyMerkleTree: Tree too large")
    })

    for (let depth = 1; depth < 6; depth += 1) {
        it(`should insert leaves in tree with depth ${depth}`, async () => {
            const { contract } = await run("deploy:lmt-test", { logs: false })
            await contract.init(10)
            // empty root should be H(0, 0)
            expect(await contract.root()).to.equal(poseidon2([0n, 0n]))
            const elements = []
            for (let x = 0; x < 2 ** depth - 1; x += 1) {
                const e = random()
                elements.push(e)
                // construct the tree
                {
                    const targetDepth = Math.max(1, Math.ceil(Math.log2(elements.length)))
                    const merkleTree = new IncrementalMerkleTree(poseidon2, targetDepth, 0n)
                    for (const _e of elements) {
                        merkleTree.insert(_e)
                    }
                    await contract.insert(e)
                    await contract.benchmarkRoot().then((t) => t.wait())
                    const root = await contract.root()
                    expect(root.toString()).to.equal(merkleTree.root.toString())
                }
                const treeData = await contract.data()
                expect(treeData.numberOfLeaves).to.equal(elements.length)
                for (let y = depth; y < 12; y += 1) {
                    const merkleTree = new IncrementalMerkleTree(poseidon2, y, 0n)
                    for (const _e of elements) {
                        merkleTree.insert(_e)
                    }
                    const root = await contract.staticRoot(y)
                    expect(root.toString()).to.equal(merkleTree.root.toString())
                }
            }
        })
    }

    it("should fail to insert too many leaves", async () => {
        const { contract } = await run("deploy:lmt-test", { logs: false })
        const depth = 5
        await contract.init(depth)
        for (let x = 0; x < 2 ** depth - 1; x += 1) {
            await contract.insert(random())
        }
        await expect(contract.insert(random())).to.be.revertedWith("LazyMerkleTree: tree is full")
    })

    it("should fail to insert leaf outside of field", async () => {
        const { contract, lazyMerkleTree } = await run("deploy:lmt-test", { logs: false })
        const depth = 5
        await contract.init(depth)
        const F = await lazyMerkleTree.SNARK_SCALAR_FIELD()
        await expect(contract.insert(F)).to.be.revertedWith("LazyMerkleTree: leaf must be < SNARK_SCALAR_FIELD")
    })

    // update tests

    for (let depth = 1; depth < 5; depth += 1) {
        it(`should update leaves in tree with depth ${depth}`, async () => {
            const { contract } = await run("deploy:lmt-test", { logs: false })
            await contract.init(depth)
            const elements = []
            // runs in ~N^N
            for (let x = 0; x < 2 ** depth - 1; x += 1) {
                const e = random()
                elements.push(e)
                // construct the tree
                const targetDepth = Math.max(1, Math.ceil(Math.log2(elements.length)))
                {
                    const merkleTree = new IncrementalMerkleTree(poseidon2, targetDepth, 0n)
                    for (const _e of elements) {
                        merkleTree.insert(_e)
                    }
                    await contract.insert(e)
                    await contract.benchmarkRoot().then((t) => t.wait())
                    const root = await contract.root()
                    expect(root.toString()).to.equal(merkleTree.root.toString())
                    const treeData = await contract.data()
                    expect(treeData.numberOfLeaves).to.equal(elements.length)
                }
                for (let y = 0; y < x; y += 1) {
                    const newE = random()
                    elements.splice(y, 1, newE)
                    await contract.update(newE, y)
                    const merkleTree = new IncrementalMerkleTree(poseidon2, targetDepth, 0n)
                    for (const _e of elements) {
                        merkleTree.insert(_e)
                    }
                    const root = await contract.root()
                    expect(root.toString()).to.equal(merkleTree.root.toString())
                    const treeData = await contract.data()
                    expect(treeData.numberOfLeaves).to.equal(elements.length)
                }
            }
        })
    }

    it("should fail to update invalid leaf index", async () => {
        const { contract } = await run("deploy:lmt-test", { logs: false })
        const depth = 4
        await contract.init(depth)
        for (let x = 0; x < 10; x += 1) {
            await contract.insert(random())
        }
        await expect(contract.update(random(), 10)).to.be.revertedWith("LazyMerkleTree: leaf must exist")
    })

    it("should fail to update with invalid leaf value", async () => {
        const { contract, lazyMerkleTree } = await run("deploy:lmt-test", { logs: false })
        const depth = 4
        await contract.init(depth)
        for (let x = 0; x < 3; x += 1) {
            await contract.insert(random())
        }
        const F = await lazyMerkleTree.SNARK_SCALAR_FIELD()
        await expect(contract.update(F, 0)).to.be.revertedWith("LazyMerkleTree: leaf must be < SNARK_SCALAR_FIELD")
    })

    it("should reset and reuse tree", async () => {
        const { contract } = await run("deploy:lmt-test", { logs: false })
        const depth = 4
        await contract.init(10)
        {
            const data = await contract.data()
            expect(data.numberOfLeaves).to.equal(0)
        }
        for (let i = 0; i < 3; i += 1) {
            const elements = []
            for (let x = 0; x < 2 ** depth - 1; x += 1) {
                const e = random()
                elements.push(e)
                // construct the tree
                const targetDepth = Math.max(1, Math.ceil(Math.log2(elements.length)))
                const merkleTree = new IncrementalMerkleTree(poseidon2, targetDepth, 0n)
                for (const _e of elements) {
                    merkleTree.insert(_e)
                }
                await contract.insert(e)
                const root = await contract.root()
                expect(root.toString()).to.equal(merkleTree.root.toString())
                const treeData = await contract.data()
                expect(treeData.numberOfLeaves).to.equal(elements.length)
            }
            await contract.reset()
            {
                const data = await contract.data()
                expect(data.numberOfLeaves).to.equal(0)
            }
        }
    })

    it("should fail to generate out of range static root", async () => {
        const { contract } = await run("deploy:lmt-test", { logs: false })
        await contract.init(10)

        const elements = []
        for (let x = 0; x < 20; x += 1) {
            const e = random()
            elements.push(e)
            await contract.insert(e)
        }
        await expect(contract.staticRoot(4)).to.be.revertedWith("LazyMerkleTree: ambiguous depth")
        await expect(contract.staticRoot(33)).to.be.revertedWith("LazyMerkleTree: depth must be < MAX_DEPTH")
    })
})
