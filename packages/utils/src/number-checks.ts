import { BigNumber, BigNumberish } from "./types"

export function isStringifiedBigint(s: BigNumber | string): boolean {
    try {
        BigInt(s)

        return true
    } catch (e) {
        return false
    }
}

export function isHexadecimal(s: string) {
    return /^(0x|0X)[0-9a-fA-F]+$/.test(s)
}

export function isBigNumberish(value: BigNumberish): boolean {
    return (
        typeof value === "number" ||
        typeof value === "bigint" ||
        (typeof value === "string" && isStringifiedBigint(value)) ||
        (typeof value === "string" && isHexadecimal(value)) ||
        Buffer.isBuffer(value)
    )
}
