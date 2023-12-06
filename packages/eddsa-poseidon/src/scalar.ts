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

export function gt(a: bigint, b: bigint) {
    return a > b
}

export function bits(n: bigint): number[] {
    const res = []
    let E = n

    while (E) {
        if (E & BigInt(1)) {
            res.push(1)
        } else {
            res.push(0)
        }

        E >>= BigInt(1)
    }

    return res
}
