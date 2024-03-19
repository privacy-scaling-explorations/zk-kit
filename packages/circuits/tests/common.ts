import { Circomkit } from "circomkit"
import { readFileSync } from "fs"
import path from "path"
import { Point, mulPointEscalar } from "@zk-kit/baby-jubjub"
import { deriveSecretScalar } from "@zk-kit/eddsa-poseidon"
import { LeanIMT } from "@zk-kit/imt"
import { poseidon2 } from "poseidon-lite"

/**
 * Represents the proof data for a leaf in a Merkle tree, providing all necessary
 * information required to verify the leaf's inclusion in the tree.
 *
 * @typeParam leaf the leaf value.
 * @typeParam depth the actual depth of the Merkle tree.
 * @typeParam indices binary representation of the `leafIndex` path.
 * @typeParam siblings nodes encountered when traversing from the leaf to the root.
 * @typeParam root the Merkle root of the tree, calculated from all the leaves.
 */
export type BinaryMerkleTreeProof = {
    leaf: bigint
    depth: number
    indices: number[]
    siblings: bigint[]
    root: bigint
}

const configFilePath = path.join(__dirname, "../circomkit.json")
const config = JSON.parse(readFileSync(configFilePath, "utf-8"))

// eslint-disable-next-line import/prefer-default-export
export const circomkit = new Circomkit({
    ...config,
    verbose: false
})

/**
 * Generates an Elliptic-Curve Diffie–Hellman (ECDH) shared key given a private
 * key and a public key.
 * @param privKey A private key generated using genPrivKey()
 * @param pubKey A public key generated using genPubKey()
 * @returns The ECDH shared key.
 */
export const genEcdhSharedKey = (privKey: Buffer | Uint8Array | string, pubKey: [bigint, bigint]): Point<bigint> => {
    const secretScalar = deriveSecretScalar(privKey)

    return mulPointEscalar(pubKey, secretScalar) as Point<bigint>
}

/**
 * Generates a binary Merkle tree and a proof for a given leaf index.
 * @param maxDepth The maximum depth of the binary Merkle tree.
 * Defaults to 5. This is used to calculate the path indices for the proof.
 * @param nodes The total number of nodes (leaves) to be inserted
 * into the tree. Defaults to 32.
 * @param leafIndex The index of the leaf for which to generate
 * the proof. Defaults to 0.
 * @returns An object structured to provide the necessary inputs
 * and output for a binary Merkle root proof verification for the
 * `binary-merkle-root` circuit.
 */
export const generateBinaryMerkleRoot = (maxDepth = 5, nodes = 32, leafIndex = 0): BinaryMerkleTreeProof => {
    const tree = new LeanIMT((a, b) => poseidon2([a, b]))
    const leaf = BigInt(0)

    tree.insert(leaf)

    for (let i = 1; i < nodes; i += 1) {
        tree.insert(BigInt(i))
    }

    const { siblings, index } = tree.generateProof(leafIndex)

    // The index must be converted to a list of indices, 1 for each tree level.
    // The circuit tree depth is 20, so the number of siblings must be 20, even if
    // the tree depth is actually 3. The missing siblings can be set to 0, as they
    // won't be used to calculate the root in the circuit.
    const indices: number[] = []

    for (let i = 0; i < maxDepth; i += 1) {
        indices.push((index >> i) & 1)

        if (siblings[i] === undefined) {
            siblings[i] = BigInt(0)
        }
    }

    return {
        leaf,
        depth: tree.depth,
        indices,
        siblings,
        root: tree.root
    }
}
