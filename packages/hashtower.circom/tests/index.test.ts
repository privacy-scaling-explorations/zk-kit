import * as path from "path"
import { getTester, getUtils } from "./utils"

/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "ok", "fail"] }] */

async function utils(templateName: string, args: number[]) {
    const srcPath = path.join(__dirname, "..", "circuits", "hashtower-hash-chain.circom")
    const circomlibPath = path.join(__dirname, "..", "..", "..", "node_modules", "circomlib", "circuits")
    const tester = await getTester(srcPath, templateName, args, { include: [circomlibPath] })
    return getUtils(tester)
}

describe("PickOne circuit", () => {
    it("PickOne", async () => {
        const { ok, fail } = await utils("PickOne", [4])

        await ok({ in: [100, 200, 300, 400], sel: 0 }, { out: 100 })
        await ok({ in: [100, 200, 300, 400], sel: 1 }, { out: 200 })
        await ok({ in: [100, 200, 300, 400], sel: 2 }, { out: 300 })
        await ok({ in: [100, 200, 300, 400], sel: 3 }, { out: 400 })

        await fail({ in: [100, 200, 300, 400], sel: 4 }) // out of bounds
    })
})
