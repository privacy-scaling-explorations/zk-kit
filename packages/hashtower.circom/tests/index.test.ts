import * as path from "path"
import { poseidon2 } from "poseidon-lite"
import { getTester, getUtils } from "./utils"

/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "ok", "fail"] }] */

async function utils(templateName: string, args: number[]) {
    const srcPath = path.join(__dirname, "..", "circuits", "hashtower-hash-chain.circom")
    const circomlibPath = path.join(__dirname, "..", "..", "..", "node_modules", "circomlib", "circuits")
    const tester = await getTester(srcPath, templateName, args, { include: [circomlibPath] })
    return getUtils(tester)
}

describe("PickOne", () => {
    it("PickOne", async () => {
        const { ok, fail } = await utils("PickOne", [4])

        await ok({ in: [100, 200, 300, 400], sel: 0 }, { out: 100 })
        await ok({ in: [100, 200, 300, 400], sel: 1 }, { out: 200 })
        await ok({ in: [100, 200, 300, 400], sel: 2 }, { out: 300 })
        await ok({ in: [100, 200, 300, 400], sel: 3 }, { out: 400 })

        await fail({ in: [100, 200, 300, 400], sel: 4 }) // out of bounds
    })
})

describe("HashChain", () => {
    it("HashChain", async () => {
        const { ok, fail } = await utils("HashChain", [4])

        await ok({ in: [0, 1, 2, 3], len: 0 }, { out: 0 })
        await ok({ in: [0, 1, 2, 3], len: 1 }, { out: 0 })
        await ok(
            { in: [0, 1, 2, 3], len: 2 },
            { out: BigInt("12583541437132735734108669866114103169564651237895298778035846191048104863326") }
        )
        await ok(
            { in: [0, 1, 2, 3], len: 3 },
            { out: BigInt("11790059851550142146278072775670916642282838830554510149311470233718605478544") }
        )
        await ok(
            { in: [0, 1, 2, 3], len: 4 },
            { out: BigInt("20127075603631019434055928315203707068407414306847615530687456290565086592967") }
        )

        const H = (a, b) => poseidon2([a, b])
        await ok({ in: [100, 200, 300, 400], len: 0 }, { out: 0 })
        await ok({ in: [100, 200, 300, 400], len: 1 }, { out: 100 })
        await ok({ in: [100, 200, 300, 400], len: 2 }, { out: H(100, 200) })
        await ok({ in: [100, 200, 300, 400], len: 3 }, { out: H(H(100, 200), 300) })
        await ok({ in: [100, 200, 300, 400], len: 4 }, { out: H(H(H(100, 200), 300), 400) })

        await fail({ in: [100, 200, 300, 400], len: 5 })
    })
})

describe("RotateLeft", () => {
    it("RotateLeft", async () => {
        const { ok, fail } = await utils("RotateLeft", [4])

        await ok({ in: [6, 7, 8, 9], n: 0 }, { out: [6, 7, 8, 9] })
        await ok({ in: [6, 7, 8, 9], n: 1 }, { out: [7, 8, 9, 6] })
        await ok({ in: [6, 7, 8, 9], n: 2 }, { out: [8, 9, 6, 7] })
        await ok({ in: [6, 7, 8, 9], n: 3 }, { out: [9, 6, 7, 8] })

        await fail({ in: [6, 7, 8, 9], n: 4 }) // out of bounds
    })
})

describe("Reverse", () => {
    it("Reverse", async () => {
        const { ok } = await utils("Reverse", [4])

        await ok({ in: [6, 7, 8, 9] }, { out: [9, 8, 7, 6] })
    })
})

describe("IsNonZero", () => {
    it("IsNonZero", async () => {
        const { ok } = await utils("IsNonZero", [])

        await ok({ in: 0 }, { out: 0 })
        await ok({ in: 1 }, { out: 1 })
        await ok({ in: 2 }, { out: 1 })
        await ok({ in: 3 }, { out: 1 })
    })
})

describe("Must", () => {
    it("Must", async () => {
        const { ok, fail } = await utils("Must", [])
        await ok({ in: 1 }, {})

        await fail({ in: 0 })
        await fail({ in: 2 })
    })
})

describe("MustEQ", () => {
    it("MustEQ", async () => {
        const { ok, fail } = await utils("MustEQ", [])
        await ok({ a: 0, b: 0 }, {})
        await ok({ a: 1, b: 1 }, {})
        await ok({ a: 2, b: 2 }, {})

        await fail({ a: 0, b: 1 })
        await fail({ a: 0, b: 2 })
        await fail({ a: 2, b: 1 })
    })
})

describe("Include", () => {
    it("Include", async () => {
        const { ok } = await utils("Include", [4])
        await ok({ in: [7, 2, 3, 6], v: 7 }, { out: 1 })
        await ok({ in: [7, 2, 3, 6], v: 2 }, { out: 1 })
        await ok({ in: [7, 2, 3, 6], v: 3 }, { out: 1 })
        await ok({ in: [7, 2, 3, 6], v: 6 }, { out: 1 })

        await ok({ in: [7, 2, 3, 6], v: 8 }, { out: 0 })
        await ok({ in: [7, 2, 3, 6], v: 0 }, { out: 0 })

        await ok({ in: [0, 2, 3, 6], v: 0 }, { out: 1 })
        await ok({ in: [7, 2, 3, 0], v: 0 }, { out: 1 })
    })
})
