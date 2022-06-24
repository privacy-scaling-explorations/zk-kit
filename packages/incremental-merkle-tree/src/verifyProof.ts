import checkParameter from "./checkParameter"
import { HashFunction, MerkleProof } from "./types"

export default function verifyProof(proof: MerkleProof, hash: HashFunction): boolean {
    checkParameter(proof, "proof", "object")
    checkParameter(proof.root, "proof.root", "number", "string", "bigint")
    checkParameter(proof.leaf, "proof.leaf", "number", "string", "bigint")
    checkParameter(proof.siblings, "proof.siblings", "object")
    checkParameter(proof.pathIndices, "proof.pathElements", "object")

    let node = proof.leaf

    for (let i = 0; i < proof.siblings.length; i += 1) {
        const children = proof.siblings[i].slice()

        children.splice(proof.pathIndices[i], 0, node)

        node = hash(children)
    }

    return proof.root === node
}
