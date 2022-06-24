export declare type Node = any;
export declare type HashFunction = (values: Node[]) => Node;
export declare type MerkleProof = {
    root: any;
    leaf: any;
    siblings: any[];
    pathIndices: number[];
};
