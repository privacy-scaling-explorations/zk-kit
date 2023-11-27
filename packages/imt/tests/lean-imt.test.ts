import { poseidon2 } from "poseidon-lite"
import { LeanIMT } from "../src"

describe("Lean IMT", () => {
    // If you change this value you need to calculate
    // the new expected roots below.
    const treeSize = 5

    const leaves = Array.from(Array(treeSize).keys()).map(BigInt)
    const poseidon = (a: bigint, b: bigint) => poseidon2([a, b])

    const roots: bigint[] = new Array(2)

    beforeAll(() => {
        // Expected root value after 5 insertions.
        {
            const n1_0 = poseidon(leaves[0], leaves[1])
            const n1_1 = poseidon(leaves[2], leaves[3])
            const n2_0 = poseidon(n1_0, n1_1)
            roots[0] = poseidon(n2_0, leaves[4])
        }
        // Expected root value after 5 updates.
        {
            const n1 = poseidon(BigInt(0), BigInt(0))
            const n2 = poseidon(n1, n1)
            roots[1] = poseidon(n2, BigInt(0))
        }
    })

    describe("# new LeanIMT", () => {
        it("Should not initialize a tree if the parameters are wrong", () => {
            const fun1 = () => new LeanIMT(undefined as any)
            const fun2 = () => new LeanIMT(1 as any)
            const fun3 = () => new LeanIMT(poseidon, "string" as any)

            expect(fun1).toThrow("Parameter 'hash' is not defined")
            expect(fun2).toThrow("Parameter 'hash' is not a function")
            expect(fun3).toThrow("Parameter 'leaves' is not an array")
        })

        it("Should initialize a tree", () => {
            const tree = new LeanIMT(poseidon)

            expect(tree.root).toBeUndefined()
            expect(tree.depth).toBe(0)
            expect(tree.leaves).toEqual([])
            expect(tree.size).toBe(0)
        })

        it("Should initialize a tree with a custom type", () => {
            const poseidon = (a: string, b: string) => poseidon2([a, b]).toString()
            const tree = new LeanIMT<string>(poseidon)

            expect(tree.root).toBeUndefined()
            expect(tree.depth).toBe(0)
            expect(tree.leaves).toEqual([])
            expect(tree.size).toBe(0)
        })

        for (let treeSize = 100; treeSize < 116; treeSize += 1) {
            it(`Should initialize a tree with ${treeSize} leaves`, () => {
                const leaves = Array.from(Array(treeSize).keys()).map(BigInt)
                const tree1 = new LeanIMT(poseidon, leaves)
                const tree2 = new LeanIMT(poseidon)

                for (const leaf of leaves) {
                    tree2.insert(BigInt(leaf))
                }

                expect(tree1.root).toEqual(tree2.root)
                expect(tree1.depth).toBe(Math.ceil(Math.log2(treeSize)))
                expect(tree1.size).toBe(treeSize)
            })
        }
    })

    describe("# indexOf", () => {
        it(`Should not return any value if the index is not defined`, () => {
            const tree = new LeanIMT(poseidon)

            const fun = () => tree.indexOf(undefined as any)

            expect(fun).toThrow("Parameter 'leaf' is not defined")
        })

        it("Should return the index of a leaf", () => {
            const tree = new LeanIMT(poseidon, leaves)

            const index = tree.indexOf(BigInt(2))

            expect(index).toBe(2)
        })
    })

    describe("# has", () => {
        it(`Should not return any value if the leaf is not defined`, () => {
            const tree = new LeanIMT(poseidon)

            const fun = () => tree.has(undefined as any)

            expect(fun).toThrow("Parameter 'leaf' is not defined")
        })

        it("Should return true if the leaf exists", () => {
            const tree = new LeanIMT(poseidon, leaves)

            const result = tree.has(BigInt(2))

            expect(result).toBe(true)
        })

        it("Should return false if the leaf does not exist", () => {
            const tree = new LeanIMT(poseidon, leaves)

            const result = tree.has(BigInt(999))

            expect(result).toBe(false)
        })
    })

    describe("# insert", () => {
        it(`Should not insert any leaf if it is not defined`, () => {
            const tree = new LeanIMT(poseidon)

            const fun = () => tree.insert(undefined as any)

            expect(fun).toThrow("Parameter 'leaf' is not defined")
        })

        it(`Should insert 1 leaf`, () => {
            const tree = new LeanIMT(poseidon)

            tree.insert(BigInt(1))

            expect(tree.root).toBe(BigInt("1"))
        })

        it(`Should insert ${treeSize} leaves`, () => {
            const tree = new LeanIMT(poseidon)

            for (let i = 0; i < treeSize; i += 1) {
                tree.insert(BigInt(i))

                expect(tree.size).toBe(i + 1)
            }

            expect(tree.root).toBe(roots[0])
        })
    })

    describe("# insertMany", () => {
        it(`Should not insert any leaf if the list of leaves is not defined`, () => {
            const tree = new LeanIMT(poseidon)

            const fun = () => tree.insertMany(undefined as any)

            expect(fun).toThrow("Parameter 'leaves' is not defined")
        })

        it(`Should not insert any leaf if the list of leaves is not a list`, () => {
            const tree = new LeanIMT(poseidon)

            const fun = () => tree.insertMany("uoe" as any)

            expect(fun).toThrow("Parameter 'leaves' is not an array")
        })

        it(`Should not insert any leaf if the list of leaves is empty`, () => {
            const tree = new LeanIMT(poseidon)

            const fun = () => tree.insertMany([])

            expect(fun).toThrow("There are no leaves to add")
        })

        it(`Should insert ${treeSize} leaves at once`, () => {
            const tree = new LeanIMT(poseidon)

            tree.insertMany(leaves)

            expect(tree.root).toBe(roots[0])
        })
    })

    describe("# update", () => {
        it(`Should not update any leaf if the parameters are not defined`, () => {
            const tree = new LeanIMT(poseidon, leaves)

            const fun1 = () => tree.update(undefined as any, BigInt(1))
            const fun2 = () => tree.update(1, undefined as any)

            expect(fun1).toThrow("Parameter 'index' is not defined")
            expect(fun2).toThrow("Parameter 'newLeaf' is not defined")
        })

        it(`Should not update any leaf if the index is not a number`, () => {
            const tree = new LeanIMT(poseidon, leaves)

            const fun = () => tree.update("uoe" as any, BigInt(3))

            expect(fun).toThrow("Parameter 'index' is not a number")
        })

        it(`Should insert 1 leaf`, () => {
            const tree = new LeanIMT(poseidon, [BigInt(0), BigInt(1)])

            tree.update(0, BigInt(2))

            expect(tree.root).toBe(poseidon(BigInt(2), BigInt(1)))
        })

        it(`Should update ${treeSize} leaves`, () => {
            const tree = new LeanIMT(poseidon, leaves)

            for (let i = 0; i < treeSize; i += 1) {
                tree.update(i, BigInt(0))
            }

            expect(tree.root).toBe(roots[1])
        })
    })

    describe("# generateProof", () => {
        it(`Should not generate any proof if the index is not defined`, () => {
            const tree = new LeanIMT(poseidon, leaves)

            const fun = () => tree.generateProof(undefined as any)

            expect(fun).toThrow("Parameter 'index' is not defined")
        })

        it(`Should not generate any proof if the index is not a number`, () => {
            const tree = new LeanIMT(poseidon, leaves)

            const fun = () => tree.generateProof("uoe" as any)

            expect(fun).toThrow("Parameter 'index' is not a number")
        })

        it("Should not generate any proof if the leaf does not exist", () => {
            const tree = new LeanIMT(poseidon, leaves)

            const fun = () => tree.generateProof(999)

            expect(fun).toThrow("The leaf at index '999' does not exist in this tree")
        })

        it("Should generate a valid proof", () => {
            const tree = new LeanIMT(poseidon, leaves)

            const proof = tree.generateProof(3)

            expect(proof.leaf).toBe(tree.leaves[3])
            expect(proof.root).toBe(tree.root)
            expect(tree.verifyProof(proof)).toBe(true)
        })

        it(`Should generate ${treeSize} valid proof`, () => {
            const tree = new LeanIMT(poseidon, leaves)

            for (let i = 0; i < treeSize; i += 1) {
                const proof = tree.generateProof(i)

                expect(proof.leaf).toBe(tree.leaves[i])
                expect(proof.root).toBe(tree.root)
                expect(tree.verifyProof(proof)).toBe(true)
            }
        })
    })

    describe("# verifyProof", () => {
        it(`Should not verify any proof if the proof is not defined`, () => {
            const tree = new LeanIMT(poseidon, leaves)

            const fun = () => tree.verifyProof(undefined as any)

            expect(fun).toThrow("Parameter 'proof' is not defined")
        })

        it(`Should not verify any proof if the proof parameters are not defined`, () => {
            const tree = new LeanIMT(poseidon, leaves)
            const proof = tree.generateProof(3)

            const fun1 = () => tree.verifyProof({ ...proof, root: undefined } as any)
            const fun2 = () => tree.verifyProof({ ...proof, leaf: undefined } as any)
            const fun3 = () => tree.verifyProof({ ...proof, siblings: undefined } as any)
            const fun4 = () => tree.verifyProof({ ...proof, index: undefined } as any)

            expect(fun1).toThrow("Parameter 'proof.root' is not defined")
            expect(fun2).toThrow("Parameter 'proof.leaf' is not defined")
            expect(fun3).toThrow("Parameter 'proof.siblings' is not defined")
            expect(fun4).toThrow("Parameter 'proof.index' is not defined")
        })

        it("Should not verify any proof if proof.siblings is not a list", () => {
            const tree = new LeanIMT(poseidon, leaves)
            const proof = tree.generateProof(3)

            const fun = () => tree.verifyProof({ ...proof, siblings: "string" as any })

            expect(fun).toThrow("Parameter 'proof.siblings' is not an array")
        })

        it("Should not verify any proof if proof.index is not a number", () => {
            const tree = new LeanIMT(poseidon, leaves)
            const proof = tree.generateProof(3)

            const fun = () => tree.verifyProof({ ...proof, index: "string" as any })

            expect(fun).toThrow("Parameter 'proof.index' is not a number")
        })

        it("Should verify a valid proof", () => {
            const tree = new LeanIMT(poseidon, leaves)

            const proof = tree.generateProof(3)

            expect(tree.verifyProof(proof)).toBe(true)
        })
    })
})
