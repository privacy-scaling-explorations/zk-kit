import checkParameter from "./checkParameter"
import { HashFunction } from "./types"

export default function _add(
    item: BigInt,
    H: number,
    W: number,
    digestFunc: HashFunction,
    levels: BigInt[][],
    fullLevels: BigInt[][]
) {
    checkParameter(item, "item", "bigint")
    let toAdd = item
    for (let lv = 0; ; lv += 1) {
        if (lv === H) {
            throw new Error("The tower is full.")
        }

        if (lv === levels.length) {
            fullLevels.push([toAdd])
            levels.push([toAdd])
            return
        }
        if (levels[lv].length < W) {
            fullLevels[lv].push(toAdd)
            levels[lv].push(toAdd)
            return
        }
        const tmp = digestFunc(levels[lv])
        fullLevels[lv].push(toAdd)
        levels[lv] = [toAdd]
        toAdd = tmp
    }
}
