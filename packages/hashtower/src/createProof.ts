import checkParameter from "./checkParameter"
import { MerkleProof, Node } from "./types"

export default function createProof(
    index: number,
    depth: number,
    arity: number,
    nodes: Node[][],
    zeroes: Node[],
    root: Node
): MerkleProof {
    checkParameter(index, "index", "number")

    if (index < 0 || index >= nodes[0].length) {
        throw new Error("The leaf does not exist in this tree")
    }

    const siblings: Node[][] = []
    const pathIndices: number[] = []
    const leafIndex = index

    for (let level = 0; level < depth; level += 1) {
        const position = index % arity
        const levelStartIndex = index - position
        const levelEndIndex = levelStartIndex + arity

        pathIndices[level] = position
        siblings[level] = []

        for (let i = levelStartIndex; i < levelEndIndex; i += 1) {
            if (i !== index) {
                if (i < nodes[level].length) {
                    siblings[level].push(nodes[level][i])
                } else {
                    siblings[level].push(zeroes[level])
                }
            }
        }

        index = Math.floor(index / arity)
    }

    return { root, leaf: nodes[0][leafIndex], pathIndices, siblings }
}
