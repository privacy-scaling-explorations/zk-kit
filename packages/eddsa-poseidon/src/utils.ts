export function pruneBuffer(buff: Buffer): Buffer {
    buff[0] &= 0xf8
    buff[31] &= 0x7f
    buff[31] |= 0x40

    return buff
}

export function isHexadecimal(s: string) {
    return /^(0x|0X)[0-9a-fA-F]+$/.test(s)
}

export function int2hex(n: bigint) {
    let hex = n.toString(16)

    // Ensure even length.
    if (hex.length % 2 !== 0) {
        hex = `0${hex}`
    }

    return hex
}

export function leBuff2int(buffer: Buffer): bigint {
    return BigInt(`0x${buffer.reverse().toString("hex")}`)
}

export function leInt2Buff(n: bigint): Buffer {
    const hex = int2hex(n)

    // Allocate buffer of the desired size, filled with zeros.
    const buffer = Buffer.alloc(32, 0)

    Buffer.from(hex, "hex").reverse().copy(buffer)

    return buffer
}
