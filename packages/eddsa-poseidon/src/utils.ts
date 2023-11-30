export function pruneBuffer(buff: Uint8Array): Uint8Array {
    buff[0] &= 0xf8
    buff[31] &= 0x7f
    buff[31] |= 0x40

    return buff
}

export function leBuff2int(buff: Uint8Array): bigint {
    let res = BigInt(0)
    let i = 0
    const buffV = new DataView(buff.buffer, buff.byteOffset, buff.byteLength)

    while (i < buff.length) {
        // if (i + 4 <= buff.length) {
        res += BigInt(buffV.getUint32(i, true)) << BigInt(i * 8)

        i += 4
        // } else {
        // res += BigInt(buffV.getUint8(i)) << BigInt(i * 8)

        // i += 1
        // }
    }

    return res
}

export function leInt2Buff(n: bigint): Uint8Array {
    let r = n

    // if (len === undefined) {
    // len = Math.floor((scalar.bitLength(n) - 1) / 8) + 1

    // if (len === 0) {
    // len = 1
    // }
    // }

    const buff = new Uint8Array(32)
    const buffV = new DataView(buff.buffer)

    let o = 0

    while (o < 32) {
        // if (o + 4 <= len) {
        buffV.setUint32(o, Number(r & BigInt(0xffffffff)), true)
        o += 4
        r >>= BigInt(32)
        // } else if (o + 2 <= len) {
        // buffV.setUint16(o, Number(r & BigInt(0xffff)), true)
        // o += 2
        // r >>= BigInt(16)
        // } else {
        // buffV.setUint8(o, Number(r & BigInt(0xff)))
        // o += 1
        // r >>= BigInt(8)
        // }
    }

    // if (r) {
    // throw new Error("Number does not fit in this length")
    // }

    return buff
}
