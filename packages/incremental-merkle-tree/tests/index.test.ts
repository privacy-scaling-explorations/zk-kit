import { poseidon2 } from "poseidon-lite"
import { IncrementalMerkleTree } from "../src"

describe("Incremental Merkle Tree", () => {
    const treeSize = 9

    describe("Binary Incremental Merkle Tree", () => {
        const poseidon = (a: bigint, b: bigint) => poseidon2([a, b])

        it("Should not initialize a tree with wrong parameters", () => {
            const fun1 = () => new IncrementalMerkleTree(undefined as any)
            const fun2 = () => new IncrementalMerkleTree(1 as any)
            const fun3 = () => new IncrementalMerkleTree(poseidon, "string" as any)

            expect(fun1).toThrow("Parameter 'hash' is not defined")
            expect(fun2).toThrow("Parameter 'hash' is not a function")
            expect(fun3).toThrow("Parameter 'leaves' is not an array")
        })

        it("Should initialize a tree", () => {
            const tree = new IncrementalMerkleTree(poseidon)

            expect(tree.root).toBeUndefined()
            expect(tree.depth).toBe(0)
            expect(tree.leaves).toEqual([])
            expect(tree.size).toBe(0)
        })

        for (let treeSize = 100; treeSize < 116; treeSize += 1) {
            it(`Should initialize a tree with ${treeSize} leaves`, () => {
                const leaves = Array.from(Array(treeSize).keys()).map(BigInt)

                const tree1 = new IncrementalMerkleTree(poseidon, leaves)
                const tree2 = new IncrementalMerkleTree(poseidon)

                for (const leaf of leaves) {
                    tree2.insert(BigInt(leaf))
                }

                expect(tree1.root).toEqual(tree2.root)
                expect(tree1.depth).toBe(Math.ceil(Math.log2(treeSize)))
                expect(tree1.size).toBe(treeSize)
            })
        }

        it(`Should insert ${treeSize} leaves`, () => {
            const tree = new IncrementalMerkleTree(poseidon)

            for (let i = 0; i < treeSize; i += 1) {
                tree.insert(BigInt(i))

                expect(tree.size).toBe(i + 1)
            }

            expect(tree.root).toBe(
                BigInt("19600656203012706013289908371706631451337562014147901658265404138670017549484")
            )
        })

        it(`Should update ${treeSize} leaves`, () => {
            const tree = new IncrementalMerkleTree(poseidon)

            for (let i = 0; i < treeSize; i += 1) {
                tree.insert(BigInt(i))
            }

            for (let i = 0; i < treeSize; i += 1) {
                tree.update(i, BigInt(0))
            }

            expect(tree.root).toBe(
                BigInt("17065579445831617191365513033949844513397288621643071341312383169025771810367")
            )
        })

        it("Should return the index of a leaf", () => {
            const tree = new IncrementalMerkleTree(poseidon, [BigInt(1), BigInt(2)])

            const index = tree.indexOf(BigInt(2))

            expect(index).toBe(1)
        })

        it("Should not generate any proof if the leaf does not exist", () => {
            const tree = new IncrementalMerkleTree(poseidon, [BigInt(1)])

            const fun = () => tree.generateProof(1)

            expect(fun).toThrow("The leaf at index '1' does not exist in this tree")
        })

        //it("Should generate and verify a valid proof", () => {
        //const tree = new IncrementalMerkleTree(poseidon, arity, [BigInt(1)])

        //for (let i = 0; i < treeSize; i += 1) {
        //tree.insert(BigInt(i))
        //}

        //for (let i = 0; i < treeSize; i += 1) {
        //const proof = tree.generateProof(i)

        //expect(proof.index).toEqual(i)
        //expect(proof.siblings).toHaveLength(tree.depth)

        //for (let j = 0; j < tree.depth; j += 1) {
        //expect(proof.siblings[j]).toHaveLength(arity - 1)

        //const leafV = Math.floor(i / arity ** j) % arity

        //expect(proof.pathIndices[j]).toEqual(leafV)
        //}

        //expect(tree.verifyProof(proof)).toBeTruthy()
        //}
        //})
    })
})
