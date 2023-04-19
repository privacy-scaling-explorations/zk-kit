import checkParameter from "./checkParameter"
import { HashFunction, HashTowerHashChainProof } from "./types"

const pad = (arr: any, len: number, val: any) => arr.concat(Array(len - arr.length).fill(val))
const pad0 = (arr: any, len: number) => pad(arr, len, BigInt(0))
const pad00 = (arr2D: any, h: number, w: number) => pad(arr2D, h, []).map((a: any) => pad0(a, w))
const bitsPerLevel = 4

export default function _build(
    idx: number,
    H: number,
    W: number,
    digestFunc: HashFunction,
    levels: BigInt[][],
    fullLevels: BigInt[][]
): HashTowerHashChainProof {
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
    const levelLengths = levels.reduce(
        (sum, level, lv) => sum | (BigInt(level.length) << BigInt(bitsPerLevel * lv)),
        BigInt(0)
    )
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
