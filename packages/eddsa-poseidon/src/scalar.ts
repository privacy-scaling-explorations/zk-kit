export function isZero(a: bigint): boolean {
    return !a
}

export function isOdd(a: bigint): boolean {
    return (a & BigInt(1)) === BigInt(1)
}

export function shiftRight(a: bigint, n: bigint): bigint {
    return a >> n
}

export function mul(a: bigint, b: bigint): bigint {
    return a * b
}
