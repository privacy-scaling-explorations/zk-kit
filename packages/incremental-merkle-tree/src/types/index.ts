export type Node = any

export type HashFunction = (values: Node[]) => Node

export type Proof = {
  root: Node
  leaf: Node
  siblingNodes: Node[]
  path: number[]
}
