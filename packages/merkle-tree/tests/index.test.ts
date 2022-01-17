import { poseidon } from "circomlibjs"
import { IncrementalMerkleTree } from "../src"

describe("Nary Merkle Tree", () => {
  const depth = 20
  const arity = 5
  let tree: IncrementalMerkleTree

  describe("Merkle Tree class", () => {
    beforeEach(() => {
      tree = new IncrementalMerkleTree(poseidon, depth, BigInt(0), arity)
    })

    it("Should not initialize a Merkle tree with wrong parameters", () => {
      expect(() => new IncrementalMerkleTree(undefined as any, 33, 0, arity)).toThrow("Parameter 'hash' is not defined")
      expect(() => new IncrementalMerkleTree(1 as any, 33, 0, arity)).toThrow(
        "Parameter 'hash' is none of these types: function"
      )
    })

    it("Should not initialize a Merkle tree with depth > 32", () => {
      expect(() => new IncrementalMerkleTree(poseidon, 33, BigInt(0), arity)).toThrow(
        "The tree depth must be between 1 and 32"
      )
    })

    it("Should initialize a Merkle tree", () => {
      expect(tree.depth).toEqual(depth)
      expect(tree.leaves).toHaveLength(0)
      expect(tree.zeroes).toHaveLength(depth)
      expect(tree.arity).toEqual(arity)
    })

    it("Should not insert a zero leaf", () => {
      expect(() => tree.insert(BigInt(0))).toThrow("The leaf cannot be a zero value")
    })

    it("Should not insert a leaf in a full tree", () => {
      const fullTree = new IncrementalMerkleTree(poseidon, 1, BigInt(0), 3)

      fullTree.insert(BigInt(1))
      fullTree.insert(BigInt(2))
      fullTree.insert(BigInt(3))

      expect(() => fullTree.insert(BigInt(4))).toThrow("The tree is full")
    })
  })

  it("Should create a valid proof", () => {
    const numberOfLeaves = 50

    for (let i = 0; i < numberOfLeaves; i += 1) {
      tree.insert(BigInt(i + 1))
    }

    for (let i = 0; i < numberOfLeaves; i += 1) {
      const proof = tree.createProof(i)
      expect(tree.verifyProof(proof)).toBeTruthy()
    }
  })
})
