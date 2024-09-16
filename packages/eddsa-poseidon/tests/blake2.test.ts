import fs from "fs"
import path from "path"
import Blake2b from "../src/blake2b"
import { hexToBytes } from "../src/utils"

describe("Blake2b Basic test", () => {
    test("Basic case should return correctly", () => {
        // From the example computation in the RFC
        const instance = new Blake2b()
        instance.update("abc")

        expect(instance.asHex()).toBe(
            "ba80a53f981c4d0d6a2797b69f12f6e94c212f14685ac4b74b12bb6fdbffa2d17d87c5392aab792dc252d5de4533cc9518d38aa8dbf1925ab92386edd4009923"
        )
    })

    test("Empty string should return correctly", () => {
        // From the example computation in the RFC
        const instance = new Blake2b()
        instance.update("")

        expect(instance.asHex()).toBe(
            "786a02f742015903c6c6fd852552d272912f4740e15847618a86e217f71f5419d25e1031afee585313896444934eb04b903a685b1448b755d56f701afe9be2ce"
        )
    })
    test("Longer string should return correctly", () => {
        // From the example computation in the RFC
        const instance = new Blake2b()
        instance.update("The quick brown fox jumps over the lazy dog")

        expect(instance.asHex()).toBe(
            "a8add4bdddfd93e4877d2746e62817b116364a1fa7bc148d95090bc7333b3673f82401cf7aa2e4cb1ecd90296e3f14cb5413f8ed77be73045b13914cdcd6a918"
        )
    })
    test("Uint8Array should work correctly", () => {
        const abcArray = Array.from("abc").map((letter) => letter.charCodeAt(0))

        const instance = new Blake2b()
        instance.update(Uint8Array.from(abcArray))

        expect(instance.asHex()).toBe(
            "ba80a53f981c4d0d6a2797b69f12f6e94c212f14685ac4b74b12bb6fdbffa2d17d87c5392aab792dc252d5de4533cc9518d38aa8dbf1925ab92386edd4009923"
        )
    })

    test("Buffer should work correctly", () => {
        const abcArray = Array.from("abc").map((letter) => letter.charCodeAt(0))

        const instance = new Blake2b()
        instance.update(Buffer.from(abcArray))

        expect(instance.asHex()).toBe(
            "ba80a53f981c4d0d6a2797b69f12f6e94c212f14685ac4b74b12bb6fdbffa2d17d87c5392aab792dc252d5de4533cc9518d38aa8dbf1925ab92386edd4009923"
        )
    })

    test("Passing an output length too high should throw", () => {
        expect(() => new Blake2b(65)).toThrow("Illegal output length, expected 0 < length <= 64")
    })

    test("Passing an output length too low should throw", () => {
        expect(() => new Blake2b(-1)).toThrow("Illegal output length, expected 0 < length <= 64")
    })
})

test("BLAKE2b generated test vectors2", () => {
    const contents = fs.readFileSync(path.resolve(__dirname, "./generated-test-vectors.txt"), "utf8")
    contents.split("\n").forEach((line) => {
        if (line.length === 0) {
            return
        }
        const parts = line.split("\t")
        const inputHex = parts[0]
        const keyHex = parts[1]
        const outLen = Number(parts[2])
        const outHex = parts[3]

        const instance = new Blake2b(outLen, hexToBytes(keyHex))
        instance.update(hexToBytes(inputHex))
        expect(instance.asHex()).toBe(outHex)
    })
})

test("Byte counter should support values up to 2**53", () => {
    const testCases = [
        { t: 1, a0: 1, a1: 0 },
        { t: 0xffffffff, a0: 0xffffffff, a1: 0 },
        { t: 0x100000000, a0: 0, a1: 1 },
        { t: 0x123456789abcd, a0: 0x6789abcd, a1: 0x12345 },
        // test 2**53 - 1
        { t: 0x1fffffffffffff, a0: 0xffffffff, a1: 0x1fffff }
    ]

    testCases.forEach((testCase) => {
        const arr = new Uint32Array([0, 0])

        // test the code that's inlined in both blake2s.js and blake2b.js
        // to make sure it splits byte counters up to 2**53 into uint32s correctly
        arr[0] ^= testCase.t
        arr[1] ^= testCase.t / 0x100000000

        expect(arr[0]).toBe(testCase.a0)
        expect(arr[1]).toBe(testCase.a1)
    })
})
