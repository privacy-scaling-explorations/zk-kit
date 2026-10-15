export type Node = string | bigint
export type Key = Node
export type Value = Node
export type EntryMark = Node

export type Entry = [Key, Value, EntryMark]
export type InternalChildNodes = [Node, Node]
export type LeafChildNodes = [Key, Value, EntryMark]
export type ChildNodes = InternalChildNodes | LeafChildNodes
export type Siblings = Node[]

export type HashFunction = (childNodes: ChildNodes) => Node

export interface EntryResponse {
    entry: Entry | Node[]
    matchingEntry?: Entry | Node[]
    siblings: Siblings
}

export interface MerkleProof extends EntryResponse {
    root: Node
    membership: boolean
}
