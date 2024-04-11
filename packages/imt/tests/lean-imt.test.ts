import { poseidon2 } from "poseidon-lite"
import { BarretenbergSync, Fr } from "@aztec/bb.js"
import { LeanIMT } from "../src"

// teaching ts how to serialize BigInt
// @ts-ignore
// eslint-disable-next-line func-names, no-extend-native
BigInt.prototype.toJSON = function () {
    return this.toString()
}

describe("Lean IMT", () => {
    // If you change this value you need to calculate
    // the new expected roots below.
    const treeSize = 5

    const leaves = Array.from(Array(treeSize).keys()).map(BigInt)

    const hashes = {
        poseidon: (a: bigint, b: bigint) => a + b,
        poseidon2: (a: bigint, b: bigint) => a + b,
        pedersen: (a: bigint, b: bigint) => a + b
    }

    const hasher = (hash: string) => hashes[hash as keyof typeof hashes]

    const roots: { [key: string]: bigint[] } = {
        poseidon: new Array(2),
        poseidon2: new Array(2),
        pedersen: new Array(2)
    }

    beforeAll(async () => {
        const bb = await BarretenbergSync.new()

        hashes.poseidon = (a: bigint, b: bigint) => poseidon2([a, b])
        hashes.poseidon2 = (a: bigint, b: bigint) =>
            BigInt(bb.poseidonHash([new Fr(BigInt(a)), new Fr(BigInt(b))]).toString())
        hashes.pedersen = (a: bigint, b: bigint) =>
            BigInt(bb.pedersenHash([new Fr(BigInt(a)), new Fr(BigInt(b))], 0).toString())

        // Expected root value after 5 insertions.
        Object.keys(hashes).forEach((hash: string) => {
            const n1_0 = hasher(hash)(leaves[0], leaves[1])
            const n1_1 = hasher(hash)(leaves[2], leaves[3])
            const n2_0 = hasher(hash)(n1_0, n1_1)
            roots[hash][0] = hasher(hash)(n2_0, leaves[4])
        })

        Object.keys(hashes).forEach((hash: string) => {
            const n1 = hasher(hash)(BigInt(0), BigInt(0))
            const n2 = hasher(hash)(n1, n1)
            roots[hash][1] = hasher(hash)(n2, BigInt(0))
        })
    })

    // describe("# new LeanIMT", () => {
    //     it.each(["poseidon", "poseidon2", "pedersen"])(
    //         "Should not initialize a tree if the parameters are wrong - %s- %s",
    //         (hash) => {
    //             const fun1 = () => new LeanIMT(undefined as any)
    //             const fun2 = () => new LeanIMT(1 as any)
    //             const fun3 = () => new LeanIMT(hasher(hash), "string" as any)

    //             expect(fun1).toThrow("Parameter 'hash' is not defined")
    //             expect(fun2).toThrow("Parameter 'hash' is not a function")
    //             expect(fun3).toThrow("Parameter 'leaves' is not an array")
    //         }
    //     )

    //     it.each(["poseidon", "poseidon2", "pedersen"])("Should initialize a tree - %s", (hash) => {
    //         const tree = new LeanIMT(hasher(hash))

    //         expect(tree.root).toBeUndefined()
    //         expect(tree.depth).toBe(0)
    //         expect(tree.leaves).toEqual([])
    //         expect(tree.size).toBe(0)
    //     })

    //     it.each(["poseidon", "poseidon2", "pedersen"])("Should initialize a tree with a custom type - %s", (hash) => {
    //         const h = (a: string, b: string) => hasher(hash)(BigInt(a), BigInt(b)).toString()
    //         const tree = new LeanIMT<string>(h)

    //         expect(tree.root).toBeUndefined()
    //         expect(tree.depth).toBe(0)
    //         expect(tree.leaves).toEqual([])
    //         expect(tree.size).toBe(0)
    //     })

    //     for (let treeSize = 100; treeSize < 116; treeSize += 1) {
    //         it.each(["poseidon", "poseidon2", "pedersen"])(
    //             `Should initialize a tree with ${treeSize} leaves - %s`,
    //             (hash) => {
    //                 const leaves = Array.from(Array(treeSize).keys()).map(BigInt)
    //                 const tree1 = new LeanIMT(hasher(hash), leaves)
    //                 const tree2 = new LeanIMT(hasher(hash))

    //                 for (const leaf of leaves) {
    //                     tree2.insert(BigInt(leaf))
    //                 }

    //                 expect(tree1.root).toEqual(tree2.root)
    //                 expect(tree1.depth).toBe(Math.ceil(Math.log2(treeSize)))
    //                 expect(tree1.size).toBe(treeSize)
    //             }
    //         )
    //     }
    // })

    // describe("# indexOf", () => {
    //     it.each(["poseidon", "poseidon2", "pedersen"])(
    //         `Should not return any value if the index is not defined - %s`,
    //         (hash) => {
    //             const tree = new LeanIMT(hasher(hash))

    //             const fun = () => tree.indexOf(undefined as any)

    //             expect(fun).toThrow("Parameter 'leaf' is not defined")
    //         }
    //     )

    //     it.each(["poseidon", "poseidon2", "pedersen"])("Should return the index of a leaf - %s", (hash) => {
    //         const tree = new LeanIMT(hasher(hash), leaves)

    //         const index = tree.indexOf(BigInt(2))

    //         expect(index).toBe(2)
    //     })
    // })

    // describe("# has", () => {
    //     it.each(["poseidon", "poseidon2", "pedersen"])(
    //         `Should not return any value if the leaf is not defined - %s`,
    //         (hash) => {
    //             const tree = new LeanIMT(hasher(hash))

    //             const fun = () => tree.has(undefined as any)

    //             expect(fun).toThrow("Parameter 'leaf' is not defined")
    //         }
    //     )

    //     it.each(["poseidon", "poseidon2", "pedersen"])("Should return true if the leaf exists - %s", (hash) => {
    //         const tree = new LeanIMT(hasher(hash), leaves)

    //         const result = tree.has(BigInt(2))

    //         expect(result).toBe(true)
    //     })

    //     it.each(["poseidon", "poseidon2", "pedersen"])(
    //         "Should return false if the leaf does not exist - %s",
    //         (hash) => {
    //             const tree = new LeanIMT(hasher(hash), leaves)

    //             const result = tree.has(BigInt(999))

    //             expect(result).toBe(false)
    //         }
    //     )
    // })

    // describe("# insert", () => {
    //     it.each(["poseidon", "poseidon2", "pedersen"])(
    //         `Should not insert any leaf if it.each(["poseidon", "poseidon2", "pedersen"]) is not defined - %s`,
    //         (hash) => {
    //             const tree = new LeanIMT(hasher(hash))

    //             const fun = () => tree.insert(undefined as any)

    //             expect(fun).toThrow("Parameter 'leaf' is not defined")
    //         }
    //     )

    it.each(["pedersen"])(`Should insert 1 leaf - %s`, (hash) => {
        const tree = new LeanIMT(hasher(hash))

        tree.insert(BigInt("0x67635fc829435949ed0ced751d11f3f823087ec463ca6ee53e253fb7e390e74"))
        tree.insert(BigInt("0x1c59022dba1d97f63021cc5a23e4fe80f019465e0ccb54de9aa91935495354a3"))
        console.log(tree.generateProof(0))

        expect(tree.root).toBe(BigInt("1"))
    })

    //     it.each(["poseidon", "poseidon2", "pedersen"])(`Should insert ${treeSize} leaves - %s`, (hash) => {
    //         const tree = new LeanIMT(hasher(hash))

    //         for (let i = 0; i < treeSize; i += 1) {
    //             tree.insert(BigInt(i))

    //             expect(tree.size).toBe(i + 1)
    //         }

    //         expect(tree.root).toBe(roots[hash][0])
    //     })
    // })

    // describe("# insertMany", () => {
    //     it.each(["poseidon", "poseidon2", "pedersen"])(
    //         `Should not insert any leaf if the list of leaves is not defined - %s`,
    //         (hash) => {
    //             const tree = new LeanIMT(hasher(hash))

    //             const fun = () => tree.insertMany(undefined as any)

    //             expect(fun).toThrow("Parameter 'leaves' is not defined")
    //         }
    //     )

    //     it.each(["poseidon", "poseidon2", "pedersen"])(
    //         `Should not insert any leaf if the list of leaves is not a list - %s`,
    //         (hash) => {
    //             const tree = new LeanIMT(hasher(hash))

    //             const fun = () => tree.insertMany("uoe" as any)

    //             expect(fun).toThrow("Parameter 'leaves' is not an array")
    //         }
    //     )

    //     it.each(["poseidon", "poseidon2", "pedersen"])(
    //         `Should not insert any leaf if the list of leaves is empty - %s`,
    //         (hash) => {
    //             const tree = new LeanIMT(hasher(hash))

    //             const fun = () => tree.insertMany([])

    //             expect(fun).toThrow("There are no leaves to add")
    //         }
    //     )

    //     it.each(["poseidon", "poseidon2", "pedersen"])(`Should insert ${treeSize} leaves at once - %s`, (hash) => {
    //         const tree = new LeanIMT(hasher(hash))

    //         tree.insertMany(leaves)

    //         expect(tree.root).toBe(roots[hash][0])
    //     })
    // })

    // describe("# update", () => {
    //     it.each(["poseidon", "poseidon2", "pedersen"])(
    //         `Should not update any leaf if the parameters are not defined - %s`,
    //         (hash) => {
    //             const tree = new LeanIMT(hasher(hash), leaves)

    //             const fun1 = () => tree.update(undefined as any, BigInt(1))
    //             const fun2 = () => tree.update(1, undefined as any)

    //             expect(fun1).toThrow("Parameter 'index' is not defined")
    //             expect(fun2).toThrow("Parameter 'newLeaf' is not defined")
    //         }
    //     )

    //     it.each(["poseidon", "poseidon2", "pedersen"])(
    //         `Should not update any leaf if the index is not a number - %s`,
    //         (hash) => {
    //             const tree = new LeanIMT(hasher(hash), leaves)

    //             const fun = () => tree.update("uoe" as any, BigInt(3))

    //             expect(fun).toThrow("Parameter 'index' is not a number")
    //         }
    //     )

    //     it.each(["poseidon", "poseidon2", "pedersen"])(`Should insert 1 leaf - %s`, (hash) => {
    //         const tree = new LeanIMT(hasher(hash), [BigInt(0), BigInt(1)])

    //         tree.update(0, BigInt(2))

    //         expect(tree.root).toBe(hasher(hash)(BigInt(2), BigInt(1)))
    //     })

    //     it.each(["poseidon", "poseidon2", "pedersen"])(`Should update ${treeSize} leaves - %s`, (hash) => {
    //         const tree = new LeanIMT(hasher(hash), leaves)

    //         for (let i = 0; i < treeSize; i += 1) {
    //             tree.update(i, BigInt(0))
    //         }

    //         expect(tree.root).toBe(roots[hash][1])
    //     })
    // })

    // describe("# generateProof", () => {
    //     it.each(["poseidon", "poseidon2", "pedersen"])(
    //         `Should not generate any proof if the index is not defined - %s`,
    //         (hash) => {
    //             const tree = new LeanIMT(hasher(hash), leaves)

    //             const fun = () => tree.generateProof(undefined as any)

    //             expect(fun).toThrow("Parameter 'index' is not defined")
    //         }
    //     )

    //     it.each(["poseidon", "poseidon2", "pedersen"])(
    //         `Should not generate any proof if the index is not a number - %s`,
    //         (hash) => {
    //             const tree = new LeanIMT(hasher(hash), leaves)

    //             const fun = () => tree.generateProof("uoe" as any)

    //             expect(fun).toThrow("Parameter 'index' is not a number")
    //         }
    //     )

    //     it.each(["poseidon", "poseidon2", "pedersen"])(
    //         "Should not generate any proof if the leaf does not exist - %s- %s",
    //         (hash) => {
    //             const tree = new LeanIMT(hasher(hash), leaves)

    //             const fun = () => tree.generateProof(999)

    //             expect(fun).toThrow("The leaf at index '999' does not exist in this tree")
    //         }
    //     )

    //     it.each(["poseidon", "poseidon2", "pedersen"])("Should generate a valid proof - %s", (hash) => {
    //         const tree = new LeanIMT(hasher(hash), leaves)

    //         const proof = tree.generateProof(3)

    //         expect(proof.leaf).toBe(tree.leaves[3])
    //         expect(proof.root).toBe(tree.root)
    //         expect(tree.verifyProof(proof)).toBe(true)
    //     })

    //     it.each(["poseidon", "poseidon2", "pedersen"])(`Should generate ${treeSize} valid proof - %s`, (hash) => {
    //         const tree = new LeanIMT(hasher(hash), leaves)

    //         for (let i = 0; i < treeSize; i += 1) {
    //             const proof = tree.generateProof(i)

    //             expect(proof.leaf).toBe(tree.leaves[i])
    //             expect(proof.root).toBe(tree.root)
    //             expect(tree.verifyProof(proof)).toBe(true)
    //         }
    //     })
    // })

    // describe("# verifyProof", () => {
    //     it.each(["poseidon", "poseidon2", "pedersen"])(
    //         `Should not verify any proof if the proof is not defined - %s`,
    //         (hash) => {
    //             const tree = new LeanIMT(hasher(hash), leaves)

    //             const fun = () => tree.verifyProof(undefined as any)

    //             expect(fun).toThrow("Parameter 'proof' is not defined")
    //         }
    //     )

    //     it.each(["poseidon", "poseidon2", "pedersen"])(
    //         `Should not verify any proof if the proof parameters are not defined - %s`,
    //         (hash) => {
    //             const tree = new LeanIMT(hasher(hash), leaves)
    //             const proof = tree.generateProof(3)

    //             const fun1 = () => tree.verifyProof({ ...proof, root: undefined } as any)
    //             const fun2 = () => tree.verifyProof({ ...proof, leaf: undefined } as any)
    //             const fun3 = () => tree.verifyProof({ ...proof, siblings: undefined } as any)
    //             const fun4 = () => tree.verifyProof({ ...proof, index: undefined } as any)

    //             expect(fun1).toThrow("Parameter 'proof.root' is not defined")
    //             expect(fun2).toThrow("Parameter 'proof.leaf' is not defined")
    //             expect(fun3).toThrow("Parameter 'proof.siblings' is not defined")
    //             expect(fun4).toThrow("Parameter 'proof.index' is not defined")
    //         }
    //     )

    //     it.each(["poseidon", "poseidon2", "pedersen"])(
    //         "Should not verify any proof if proof.siblings is not a list - %s",
    //         (hash) => {
    //             const tree = new LeanIMT(hasher(hash), leaves)
    //             const proof = tree.generateProof(3)

    //             const fun = () => tree.verifyProof({ ...proof, siblings: "string" as any })

    //             expect(fun).toThrow("Parameter 'proof.siblings' is not an array")
    //         }
    //     )

    //     it.each(["poseidon", "poseidon2", "pedersen"])(
    //         "Should not verify any proof if proof.index is not a number - %s",
    //         (hash) => {
    //             const tree = new LeanIMT(hasher(hash), leaves)
    //             const proof = tree.generateProof(3)

    //             const fun = () => tree.verifyProof({ ...proof, index: "string" as any })

    //             expect(fun).toThrow("Parameter 'proof.index' is not a number")
    //         }
    //     )

    //     it.each(["poseidon", "poseidon2", "pedersen"])("Should verify a valid proof - %s", (hash) => {
    //         const tree = new LeanIMT(hasher(hash), leaves)

    //         const proof = tree.generateProof(3)

    //         expect(tree.verifyProof(proof)).toBe(true)
    //         expect(LeanIMT.verifyProof(proof, hasher(hash))).toBe(true)
    //     })

    //     it.each(["poseidon", "poseidon2", "pedersen"])(
    //         "Should reject a proof with incorrect hash function - %s",
    //         (hash) => {
    //             const tree = new LeanIMT(hasher(hash), leaves)

    //             const proof = tree.generateProof(3)

    //             function badHash(a: bigint, b: bigint): bigint {
    //                 return a + b
    //             }
    //             expect(LeanIMT.verifyProof(proof, badHash)).toBe(false)
    //         }
    //     )
    // })

    // describe("# import/export", () => {
    //     it.each(["poseidon", "poseidon2", "pedersen"])("Should export a tree - %s", (hash) => {
    //         const tree = new LeanIMT(hasher(hash), leaves)

    //         const exportedTree = tree.export()

    //         expect(typeof exportedTree).toBe("string")
    //         expect(JSON.parse(exportedTree)).toHaveLength(4)
    //         expect(JSON.parse(exportedTree)[0]).toHaveLength(5)
    //     })

    //     it.each(["poseidon", "poseidon2", "pedersen"])(
    //         "Should not import a tree if the exported tree is not defined - %s",
    //         (hash) => {
    //             const tree = new LeanIMT(hasher(hash), leaves)

    //             const fun = () => tree.import(undefined as any)

    //             expect(fun).toThrow("Parameter 'nodes' is not defined")
    //         }
    //     )

    //     it.each(["poseidon", "poseidon2", "pedersen"])(
    //         "Should not import a tree if the exported tree is not a string - %s",
    //         (hash) => {
    //             const tree = new LeanIMT(hasher(hash), leaves)

    //             const fun = () => tree.import(1 as any)

    //             expect(fun).toThrow("Parameter 'nodes' is not a string")
    //         }
    //     )

    //     it.each(["poseidon", "poseidon2", "pedersen"])("Should not import a tree if is not empty - %s", (hash) => {
    //         const tree1 = new LeanIMT(hasher(hash), leaves)
    //         const exportedTree = tree1.export()

    //         const tree2 = new LeanIMT(hasher(hash), leaves)

    //         const fun = () => tree2.import(exportedTree)

    //         expect(fun).toThrow("Import failed: the target tree structure is not empty")
    //     })

    //     it.each(["poseidon", "poseidon2", "pedersen"])("Should import a tree - %s", (hash) => {
    //         const tree1 = new LeanIMT(hasher(hash), leaves)
    //         const exportedTree = tree1.export()

    //         const tree2 = new LeanIMT(hasher(hash))

    //         tree2.import(exportedTree)

    //         tree1.insert(BigInt(4))
    //         tree2.insert(BigInt(4))

    //         expect(tree2.depth).toBe(tree1.depth)
    //         expect(tree2.size).toBe(tree1.size)
    //         expect(tree2.root).toBe(tree1.root)
    //     })
    // })
})
