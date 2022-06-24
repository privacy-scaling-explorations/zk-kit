import checkParameter from "./checkParameter"
import { Node } from "./types"

export default function indexOf(leaf: Node, nodes: Node[][]): number {
    checkParameter(leaf, "leaf", "number", "string", "bigint")

    return nodes[0].indexOf(leaf)
}
