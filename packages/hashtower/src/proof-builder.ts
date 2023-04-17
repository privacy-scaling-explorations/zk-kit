import checkParameter from "./checkParameter"
import { HashFunction, HashTowerHashChainProof, Value } from "./types"

const pad = (arr: any, len: number, val: any) => arr.concat(Array(len - arr.length).fill(val))
const pad0 = (arr: any, len: number) => pad(arr, len, BigInt(0))
const pad00 = (arr2D: any, h: number, w: number) => pad(arr2D, h, []).map((a: any) => pad0(a, w))
const sum = (a: number, b: number) => a + b

export default class HashTowerHashChainProofBuilder {
    private readonly _H: number
    private readonly _W: number
    private readonly _bitsPerLevel: number
    private readonly _digest: (vs: Value[]) => Value
    private readonly _levels: Value[][]
    private readonly _events: Value[][]

    // TODO: doc
    // H does not have to be the same with the H of the contract
    constructor(H: number, W: number, bitsPerLevel: number, hash: HashFunction) {
        checkParameter(H, "H", "number")
        checkParameter(W, "W", "number")
        checkParameter(bitsPerLevel, "bitsPerLevel", "number")
        checkParameter(hash, "hash", "function")
        this._H = H
        this._W = W
        this._bitsPerLevel = bitsPerLevel
        this._digest = (vs: Value[]) => vs.reduce((acc, v) => hash([acc, v]))
        this._levels = []
        this._events = []
    }

    public add(item: Value) {
        checkParameter(item, "item", "bigint")
        this._add(0, item)
    }
    private _add(lv: number, toAdd: Value) {
        if (lv === this._H) {
            throw new Error("The tower is full.")
        }
        if (lv === this._levels.length) {
            this._levels.push([])
            this._events.push([])
        }

        this._events[lv].push(toAdd)

        const level = this._levels[lv]
        if (level.length < this._W) {
            level.push(toAdd)
        } else {
            this._add(lv + 1, this._digest(level))
            this._levels[lv] = [toAdd]
        }
    }

    public indexOf(item: Value) {
        checkParameter(item, "item", "bigint")
        return this._events[0].indexOf(item)
    }

    public build(idx: number): HashTowerHashChainProof {
        checkParameter(idx, "idx", "number")
        if (idx < 0 || this._events[0] === undefined || idx >= this._events[0].length) {
            throw new Error(`index out of range: ${idx}`)
        }
        const item = this._events[0][idx]
        let digests = this._levels.map(this._digest)
        const digestOfDigests = this._digest(digests.reverse())
        const levelLengths = this._levels.map((level, lv) => level.length << (this._bitsPerLevel * lv)).reduce(sum)
        const H = this._H
        const W = this._W
        let childrens = []
        for (let lv = 0; ; lv += 1) {
            const levelStart = this._events[lv].length - this._levels[lv].length
            const start = idx - (idx % W)
            if (start === levelStart) {
                // we are in the tower now
                digests = pad0(digests, H)
                const rootLv = lv
                const rootLevel = pad0(this._events[lv].slice(start, start + this._levels[lv].length), W)
                childrens = pad00(childrens, H, W)
                return { levelLengths, digestOfDigests, digests, rootLv, rootLevel, childrens, item }
            }
            childrens.push(this._events[lv].slice(start, start + W))
            idx = Math.floor(idx / W)
        }
    }
}
