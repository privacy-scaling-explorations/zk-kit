import { Buffer } from "buffer"
import {
    beBigIntToBuffer,
    beBufferToBigInt,
    bigIntToHexadecimal,
    bigNumberishToBigInt,
    bigNumberishToBuffer,
    bufferToHexadecimal,
    hexadecimalToBigInt,
    hexadecimalToBuffer,
    leBigIntToBuffer,
    leBufferToBigInt
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
        it("Should convert a bigint to a hexadecimal", async () => {
            const result = bigIntToHexadecimal(testBigInt1BE)

            expect(result).toBe(testHex1BE.slice(4))
        })

        it("Should throw an error if the parameter is not a bigint", async () => {
            const fun = () => bigIntToHexadecimal(32 as any)

            expect(fun).toThrow("Parameter 'value' is not a bigint, received type: number")
        })
    })

    describe("# hexadecimalToBigInt", () => {
        it("Should convert a bigint to a hexadecimal", async () => {
            const result = hexadecimalToBigInt(testHex1BE)

            expect(result).toBe(testBigInt1BE)
        })

        it("Should convert a bigint to a hexadecimal adding the '0x' prefix if missing", async () => {
            const result = hexadecimalToBigInt(testHex1BE.slice(2))

            expect(result).toBe(testBigInt1BE)
        })

        it("Should throw an error if the parameter is not a valid hexadecimal", async () => {
            const fun = () => hexadecimalToBigInt(32 as any)

            expect(fun).toThrow("Parameter 'value' is not a hexadecimal")
        })
    })

    describe("# bigNumberishToBuffer", () => {
        it("Should convert a big numberish (number) to a buffer", async () => {
            const n = 1234

            const result = bigNumberishToBuffer(n)

            expect(result).toStrictEqual(Buffer.from([0x04, 0xd2]))
        })

        it("Should convert a big numberish (bigint) to a buffer", async () => {
            const result = bigNumberishToBuffer(testBigInt1BE)

            expect(result).toStrictEqual(Buffer.from(testBytes1.slice(1)))
        })

        it("Should convert a big numberish (stringified bigint) to a buffer", async () => {
            const result = bigNumberishToBuffer(testBigInt1BE.toString())

            expect(result).toStrictEqual(Buffer.from(testBytes1.slice(1)))
        })

        it("Should convert a big numberish (hexadecimal) to a buffer", async () => {
            const result = bigNumberishToBuffer(testHex1BE)

            expect(result).toStrictEqual(Buffer.from(testBytes1.slice(1)))
        })

        it("Should convert a big numberish (buffer) to a buffer", async () => {
            const result = bigNumberishToBuffer(Buffer.from(testHex1BE))

            expect(result).toStrictEqual(Buffer.from(testHex1BE))
        })

        it("Should throw an error if the parameter is not a valid bignumber-ish", async () => {
            const fun = () => bigNumberishToBuffer("string" as any)

            expect(fun).toThrow("Parameter 'value' is not a bignumber-ish")
        })
    })

    describe("# bigNumberishToBigInt", () => {
        it("Should convert a big numberish (number) to a bigint", async () => {
            const n = 1234

            const result = bigNumberishToBigInt(n)

            expect(result).toBe(BigInt(n))
        })

        it("Should convert a big numberish (bigint) to a bigint", async () => {
            const result = bigNumberishToBigInt(testBigInt1BE)

            expect(result).toBe(testBigInt1BE)
        })

        it("Should convert a big numberish (stringified bigint) to a bigint", async () => {
            const result = bigNumberishToBigInt(testBigInt1BE.toString())

            expect(result).toBe(testBigInt1BE)
        })

        it("Should convert a big numberish (hexadecimal) to a bigint", async () => {
            const result = bigNumberishToBigInt(testHex1BE)

            expect(result).toBe(testBigInt1BE)
        })

        it("Should convert a big numberish (buffer) to a bigint", async () => {
            const result = bigNumberishToBigInt(Buffer.from(testBytes1))

            expect(result).toBe(testBigInt1BE)
        })

        it("Should throw an error if the parameter is not a valid bignumber-ish", async () => {
            const fun = () => bigNumberishToBigInt("string" as any)

            expect(fun).toThrow("Parameter 'value' is not a bignumber-ish")
        })
    })

    describe("# bufferToHexadecimal", () => {
        it("Should convert a BE buffer to a hexadecimal string", async () => {
            const result = bufferToHexadecimal(Buffer.from(testBytes1))

            expect(result).toBe(testHex1BE.slice(2))
        })

        it("Should throw an error if the input is not a valid buffer (BE)", async () => {
            const fun = () => bufferToHexadecimal(1 as any)

            expect(fun).toThrow("Parameter 'value' is none of the following types: Buffer, Uint8Array")
        })
    })

    describe("# hexadecimalToBuffer", () => {
        it("Should convert a BE hexadecimal string to a buffer", async () => {
            const result = hexadecimalToBuffer(testHex1BE.slice(2))

            expect(result).toStrictEqual(Buffer.from(testBytes1))
        })

        it("Should throw an error if the input is not a valid hexadecimal (BE)", async () => {
            const fun = () => hexadecimalToBuffer("0x12")

            expect(fun).toThrow("Parameter 'value' is not a hexadecimal string")
        })
    })

    describe("BigInt to/from Buffer Conversions", () => {
        it("Should support little-endian conversions", async () => {
            const in1 = Buffer.from(testBytes1)
            const n1 = leBufferToBigInt(in1)
            expect(n1).toBe(testBigInt1LE)
            const out1 = leBigIntToBuffer(n1, 32)
            expect(out1).toHaveLength(32)
            expect(out1).toStrictEqual(Buffer.from(testBytes1))
        })

        it("Should support big-endian conversions", async () => {
            const in1 = Buffer.from(testBytes1)
            const n1 = beBufferToBigInt(in1)
            expect(n1).toBe(testBigInt1BE)
            const out1 = beBigIntToBuffer(n1, 32)
            expect(out1).toHaveLength(32)
            expect(out1).toStrictEqual(Buffer.from(testBytes1))
        })

        it("Should pad small numbers", async () => {
            const smallBufLE = leBigIntToBuffer(BigInt(0x020100), 32)
            expect(smallBufLE).toHaveLength(32)
            const smallOutLE = leBufferToBigInt(smallBufLE)
            expect(smallOutLE).toBe(BigInt(0x020100))

            const smallBufBE = beBigIntToBuffer(BigInt(0x020100), 32)
            expect(smallBufBE).toHaveLength(32)
            const smallOutBE = beBufferToBigInt(smallBufBE)
            expect(smallOutBE).toBe(BigInt(0x020100))
        })

        it("Should not mutate input buffers", async () => {
            const in1 = Buffer.from(testBytes1)
            expect(in1).toStrictEqual(Buffer.from(testBytes1))

            const n1LE = leBufferToBigInt(in1)
            expect(n1LE).toBe(testBigInt1LE)
            expect(in1).toStrictEqual(Buffer.from(testBytes1))

            const n1BE = beBufferToBigInt(in1)
            expect(n1BE).toBe(testBigInt1BE)
            expect(in1).toStrictEqual(Buffer.from(testBytes1))
        })

        it("Should throw an error if the specified size is too small", async () => {
            const fun1 = () => beBigIntToBuffer(testBigInt1BE, 20)
            const fun2 = () => leBigIntToBuffer(testBigInt1LE, 20)

            expect(fun1).toThrow("Size 20 is too small, need at least 31 bytes")
            expect(fun2).toThrow("Size 20 is too small, need at least 32 bytes")
        })
    })
})
