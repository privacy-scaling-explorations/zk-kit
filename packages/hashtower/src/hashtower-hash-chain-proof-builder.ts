import checkParameter from "./checkParameter"
import { HashFunction, HashTowerHashChainProof } from "./types"
import _add from "./add"
import _indexOf from "./indexOf"
import _build from "./build"

/**
 * HashTowerHashChainProofBuilder is a TypeScript implementation of HashTower to generate proofs of membership.
 */
export default class HashTowerHashChainProofBuilder {
    private readonly _H: number
    private readonly _W: number
    private readonly _digestFunc: HashFunction
    private readonly _levels: BigInt[][] = []
    private readonly _fullLevels: BigInt[][] = []

    /**
     * Initializes the proof builder.
     * @param H Height of tower of the proving circuit. It can be less than the height declared in the contract.
     * @param W Width of tower.
     * @param hash A hash function which supports 2 values.
     */
    constructor(H: number, W: number, hash: HashFunction) {
        checkParameter(H, "H", "number")
        checkParameter(W, "W", "number")
        checkParameter(hash, "hash", "function")
        this._H = H
        this._W = W
        this._digestFunc = (vs: BigInt[]) => vs.reduce((acc, v) => hash([acc, v]))
    }

    /**
     * Adds a new item in the HashTower.
     * @param item Item to be added.
     */
    public add(item: BigInt) {
        _add(item, this._H, this._W, this._digestFunc, this._levels, this._fullLevels)
    }

    /**
     * Returns the index of a item. If the item does not exist it returns -1.
     * @param item Added item.
     * @returns Index of the item.
     */
    public indexOf(item: BigInt): number {
        return _indexOf(item, this._fullLevels)
    }

    /**
     * Builds a proof of membership.
     * @param index Index of the proof's item.
     * @returns Proof object.
     */
    public build(idx: number): HashTowerHashChainProof {
        return _build(idx, this._H, this._W, this._digestFunc, this._levels, this._fullLevels)
    }
}
