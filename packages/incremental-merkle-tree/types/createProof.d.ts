import { MerkleProof, Node } from "./types";
export default function createProof(index: number, depth: number, arity: number, nodes: Node[][], zeroes: Node[], root: Node): MerkleProof;
