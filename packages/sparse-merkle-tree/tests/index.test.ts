import { poseidon, smt } from "circomlibjs"
import sha256 from "crypto-js/sha256"
import { ChildNodes, SparseMerkleTree } from "../src"

describe("Sparse Merkle tree", () => {
  const hash = (childNodes: ChildNodes) => sha256(childNodes.join("")).toString()
  const testKeys = ["a", "3", "2b", "20", "9", "17"]

  describe("Create hexadecimal trees", () => {
    it("Should create an empty sparse Merkle tree", () => {
      const tree = new SparseMerkleTree(hash)

      expect(tree.root).toBe("0")
    })

    it("Should not create a hexadecimal tree if the hash function does not return a hexadecimal", () => {
      const hash = (childNodes: ChildNodes) => poseidon(childNodes)

      const fun = () => new SparseMerkleTree(hash)

      expect(fun).toThrow()
    })
  })

  describe("Add new entries (key/value) in the tree", () => {
    it("Should add a new entry", () => {
      const tree = new SparseMerkleTree(hash)
      const oldRoot = tree.root

      tree.add("2", "a")

      expect(tree.root).not.toEqual(oldRoot)
    })

    it("Should not add a new non-hexadecimal entry", () => {
      const tree = new SparseMerkleTree(hash)

      const fun = () => tree.add(BigInt(2), BigInt(4))

      expect(fun).toThrow()
    })

    it("Should not add a new entry with an existing key", () => {
      const tree = new SparseMerkleTree(hash)

      tree.add("2", "a")
      const fun = () => tree.add("2", "a")

      expect(fun).toThrow()
    })

    it("Should add 6 new entries and create the correct root hash", () => {
      const tree = new SparseMerkleTree(hash)

      for (const key of testKeys) {
        tree.add(key, key)
      }

      expect(tree.root).toBe("40770450d00520bdab58e115dd4439c20cd39028252f3973e81fb15b02eb28f7")
    })
  })

  describe("Get values from the tree", () => {
    it("Should get a value from the tree using an existing key", () => {
      const tree = new SparseMerkleTree(hash)

      tree.add("2", "a")
      const value = tree.get("2")

      expect(value).toBe("a")
    })

    it("Should not get a value from the tree using a non-existing key", () => {
      const tree = new SparseMerkleTree(hash)

      tree.add("2", "a")
      const value = tree.get("1")

      expect(value).toBeUndefined()
    })
  })

  describe("Update values in the tree", () => {
    it("Should update a value of an existing key", () => {
      const tree = new SparseMerkleTree(hash)

      tree.add("2", "a")
      tree.update("2", "5")

      expect(tree.root).toBe("c75d3f1f5bcd6914d0331ce5ec17c0db8f2070a2d4285f8e3ff11c6ca19168ff")
    })

    it("Should not update a value with a non-existing key", () => {
      const tree = new SparseMerkleTree(hash)

      const fun = () => tree.update("1", "5")

      expect(fun).toThrow()
    })
  })

  describe("Delete entries from the tree", () => {
    it("Should delete an entry with an existing key", () => {
      const tree = new SparseMerkleTree(hash)

      tree.add("2", "a")
      tree.delete("2")

      expect(tree.root).toBe("0")
    })

    it("Should delete 3 entries and create the correct root hash", () => {
      const tree = new SparseMerkleTree(hash)

      for (const key of testKeys) {
        tree.add(key, key)
      }

      tree.delete(testKeys[1])
      tree.delete(testKeys[3])
      tree.delete(testKeys[4])

      expect(tree.root).toBe("5d2bfda7c24d9e9e59fe89a271f7d0a3435892c98bc1121b9b590d800deeca10")
    })

    it("Should not delete an entry with a non-existing key", () => {
      const tree = new SparseMerkleTree(hash)

      const fun = () => tree.delete("1")

      expect(fun).toThrow()
    })
  })

  describe("Create Merkle proofs and verify them", () => {
    it("Should create some Merkle proofs and verify them", () => {
      const tree = new SparseMerkleTree(hash)

      for (const key of testKeys) {
        tree.add(key, key)
      }

      for (let i = 0; i < 100; i += 1) {
        const randomKey = Math.floor(Math.random() * 100).toString(16)
        const proof = tree.createProof(randomKey)

        expect(tree.verifyProof(proof)).toBeTruthy()
      }

      tree.add("12", "1")

      const proof = tree.createProof("6")
      expect(tree.verifyProof(proof)).toBeTruthy()
    })

    it("Should not verify a wrong Merkle proof", () => {
      const tree = new SparseMerkleTree(hash)

      for (const key of testKeys) {
        tree.add(key, key)
      }

      const proof = tree.createProof("19")
      proof.matchingEntry = ["20", "a"]

      expect(tree.verifyProof(proof)).toBeFalsy()
    })
  })

  describe("Create big number trees", () => {
    const hash = (childNodes: ChildNodes) => poseidon(childNodes)

    it("Should create a big number tree", () => {
      const tree = new SparseMerkleTree(hash, true)

      expect(tree.root).toEqual(BigInt(0))
    })

    it("Should not create a big number tree if the hash function does not return a big number", () => {
      const hash = (childNodes: ChildNodes) => sha256(childNodes.join("")).toString()

      const fun = () => new SparseMerkleTree(hash, true)

      expect(fun).toThrow()
    })

    it("Should add a big number new entry", () => {
      const tree = new SparseMerkleTree(hash, true)
      const oldRoot = tree.root

      tree.add(BigInt(2), BigInt(4))

      expect(tree.root).not.toEqual(oldRoot)
    })

    it("Should not add a new non-big number entry", () => {
      const tree = new SparseMerkleTree(hash, true)

      const fun = () => tree.add("2", "a")

      expect(fun).toThrow()
    })
  })

  describe("Matching with Circomlib smt implementation", () => {
    it("Should create two trees with different implementations and match their root nodes", async () => {
      const hash = (childNodes: ChildNodes) => poseidon(childNodes)
      const tree = new SparseMerkleTree(hash, true)
      const tree2 = await smt.newMemEmptyTrie()
      const entries: any = [
        [
          BigInt("20438969296305830531522370305156029982566273432331621236661483041446048135547"),
          BigInt("17150136040889237739751319962368206600863150289695545292530539263327413090784")
        ],
        [
          BigInt("8459688297517826598613412977307486050019239051864711035321718508109192087854"),
          BigInt("8510347201346963732943571140849185725417245763047403804445415726302354045170")
        ],
        [
          BigInt("18746990989203767017840856832962652635369613415011636432610873672704085238844"),
          BigInt("10223238458026721676606706894638558676629446348345239719814856822628482567791")
        ],
        [
          BigInt("13924553918840562069536446401916499801909138643922241340476956069386532478098"),
          BigInt("13761779908325789083343687318102407319424329800042729673292939195255502025802")
        ]
      ]

      for await (const entry of entries) {
        tree.add(entry[0], entry[1])
        await tree2.insert(entry[0], entry[1])
      }

      expect(tree.root).toEqual(tree2.root)
    })
  })
})
