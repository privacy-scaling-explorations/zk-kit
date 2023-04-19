import checkParameter from "./checkParameter"

export default function _indexOf(item: BigInt, fullLevels: BigInt[][]) {
    checkParameter(item, "item", "bigint")
    return fullLevels[0].indexOf(item)
}
