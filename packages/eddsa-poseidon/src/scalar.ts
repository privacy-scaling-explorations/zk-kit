// const hexLen = [0, 1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4]

export function isZero(a: bigint): boolean {
    return !a
}

export function isOdd(a: bigint): boolean {
    return (a & BigInt(1)) === BigInt(1)
}

export function shiftRight(a: bigint, n: bigint): bigint {
    return a >> n
}

// export function bitLength(a: bigint): number {
// const aS = a.toString(16)

// return (aS.length - 1) * 4 + hexLen[parseInt(aS[0], 16)]
// }

export function mul(a: bigint, b: bigint): bigint {
    return a * b
}
