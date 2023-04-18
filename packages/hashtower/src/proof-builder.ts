import checkParameter from "./checkParameter"
import { HashFunction, HashTowerHashChainProof, Value } from "./types"

const pad = (arr: any, len: number, val: any) => arr.concat(Array(len - arr.length).fill(val))
const pad0 = (arr: any, len: number) => pad(arr, len, BigInt(0))
const pad00 = (arr2D: any, h: number, w: number) => pad(arr2D, h, []).map((a: any) => pad0(a, w))
const sum = (a: number, b: number) => a + b

export default function HashTowerHashChainProofBuilder(H: number, W: number, bitsPerLevel: number, hash: HashFunction) {
    checkParameter(H, "H", "number")
    checkParameter(W, "W", "number")
    checkParameter(bitsPerLevel, "bitsPerLevel", "number")
    checkParameter(hash, "hash", "function")

    const digestFunc = (vs: Value[]) => vs.reduce((acc, v) => hash([acc, v]))
    const levels: Value[][] = []
    const fullLevels: Value[][] = []

    function _add(lv: number, toAdd: Value) {
        if (lv === H) {
            throw new Error("The tower is full.")
        }

        if (lv === levels.length) {
            fullLevels.push([toAdd])
            levels.push([toAdd])
        } else if (levels[lv].length < W) {
            fullLevels[lv].push(toAdd)
            levels[lv].push(toAdd)
        } else {
            fullLevels[lv].push(toAdd)
            _add(lv + 1, digestFunc(levels[lv]))
            levels[lv] = [toAdd]
        }
    }
    function add(item: Value) {
        checkParameter(item, "item", "bigint")
        _add(0, item)
    }

    function indexOf(item: Value) {
        checkParameter(item, "item", "bigint")
        return fullLevels[0].indexOf(item)
    }

    function build(idx: number): HashTowerHashChainProof {
        checkParameter(idx, "idx", "number")
        if (levels.length === 0) {
            throw new Error("The tower is empty.")
        }
        if (idx < 0 || idx >= fullLevels[0].length) {
            throw new Error(`Index out of range: ${idx}`)
        }
        const item = fullLevels[0][idx]
        let digests = levels.map(digestFunc)
        const digestOfDigests = digestFunc(digests.reverse())
        const levelLengths = levels.map((level, lv) => level.length << (bitsPerLevel * lv)).reduce(sum)
        let childrens = []
        for (let lv = 0; ; lv += 1) {
            const levelStart = fullLevels[lv].length - levels[lv].length
            const start = idx - (idx % W)
            if (start === levelStart) {
                // we are in the tower now
                digests = pad0(digests, H)
                const rootLv = lv
                const rootLevel = pad0(fullLevels[lv].slice(start, start + levels[lv].length), W)
                childrens = pad00(childrens, H, W)
                return { levelLengths, digestOfDigests, digests, rootLv, rootLevel, childrens, item }
            }
            childrens.push(fullLevels[lv].slice(start, start + W))
            idx = Math.floor(idx / W)
        }
    }

    return { add, indexOf, build }
}
