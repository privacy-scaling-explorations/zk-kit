import {
    beBigintToBuffer,
    beBufferToBigint,
    bigIntToHexadecimal,
    bigNumberishToBigint,
    bigNumberishToBuffer,
    hexadecimalToBigint,
    leBigintToBuffer,
    leBufferToBigint
} from "../src/conversions"

describe("Conversions", () => {
    const testBytes1 = [
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10, 0x11,
        0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f
    ]
    const testHex1LE = "0x1f1e1d1c1b1a191817161514131211100f0e0d0c0b0a09080706050403020100"
    const testHex1BE = "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"
    const testBigInt1LE = BigInt(testHex1LE)
    const testBigInt1BE = BigInt(testHex1BE)

    describe("# bigintToHexadecimal", () => {
        it("Should convert a bigint to a BE hexadecimal", async () => {
            const result = bigIntToHexadecimal(testBigInt1BE)

            expect(result).toBe(testHex1BE.slice(4))
        })
    })

    describe("# hexadecimalToBigint", () => {
        it("Should convert a bigint to a BE hexadecimal", async () => {
            const result = hexadecimalToBigint(testHex1BE)

            expect(result).toBe(testBigInt1BE)
        })
    })

    describe("# bigNumberishToBuffer", () => {
        it("Should convert a big numberish to a BE buffer", async () => {
            const result = bigNumberishToBuffer(testBigInt1BE)

            expect(result).toStrictEqual(Buffer.from(testBytes1))
        })
    })

    describe("# bigNumberishToBigint", () => {
        it("Should convert a BE big numberish to a bigint", async () => {
            const result = bigNumberishToBigint(Buffer.from(testBytes1))

            expect(result).toBe(testBigInt1BE)
        })
    })

    describe("Bigint to/from Buffer Conversions", () => {
        it("Should support little-endian conversions", async () => {
            const in1 = Buffer.from(testBytes1)
            const n1 = leBufferToBigint(in1)
            expect(n1).toBe(testBigInt1LE)
            const out1 = leBigintToBuffer(n1)
            expect(out1).toHaveLength(32)
            expect(out1).toStrictEqual(Buffer.from(testBytes1))
        })

        it("Should support big-endian conversions", async () => {
            const in1 = Buffer.from(testBytes1)
            const n1 = beBufferToBigint(in1)
            expect(n1).toBe(testBigInt1BE)
            const out1 = beBigintToBuffer(n1)
            expect(out1).toHaveLength(32)
            expect(out1).toStrictEqual(Buffer.from(testBytes1))
        })

        it("Should pad small numbers", async () => {
            const smallBufLE = leBigintToBuffer(BigInt(0x020100))
            expect(smallBufLE).toHaveLength(32)
            const smallOutLE = leBufferToBigint(smallBufLE)
            expect(smallOutLE).toBe(BigInt(0x020100))

            const smallBufBE = beBigintToBuffer(BigInt(0x020100))
            expect(smallBufBE).toHaveLength(32)
            const smallOutBE = beBufferToBigint(smallBufBE)
            expect(smallOutBE).toBe(BigInt(0x020100))
        })

        it("Should not mutate input buffers", async () => {
            const in1 = Buffer.from(testBytes1)
            expect(in1).toStrictEqual(Buffer.from(testBytes1))

            const n1LE = leBufferToBigint(in1)
            expect(n1LE).toBe(testBigInt1LE)
            expect(in1).toStrictEqual(Buffer.from(testBytes1))

            const n1BE = beBufferToBigint(in1)
            expect(n1BE).toBe(testBigInt1BE)
            expect(in1).toStrictEqual(Buffer.from(testBytes1))
        })
    })
})
