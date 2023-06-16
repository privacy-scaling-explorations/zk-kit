import * as path from "path"
import { poseidon2 } from "poseidon-lite"
import { LazyTowerHashChainProofBuilder } from "../../lazytower/src"
import { getTester, getUtils } from "./utils"

/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "ok", "fail"] }] */

async function utils(templateName: string, args: number[]) {
    const srcPath = path.join(__dirname, "..", "circuits", "lazytower-hash-chain.circom")
    const libPath = path.join(__dirname, "..", "..", "..", "node_modules") // for circomlib
    const tester = await getTester(srcPath, templateName, args, { include: [libPath] })
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
    jest.setTimeout(10000)

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

        const H = (a: any, b: any) => poseidon2([a, b])
        await ok({ in: [100, 200, 300, 400], len: 0 }, { out: 0 })
        await ok({ in: [100, 200, 300, 400], len: 1 }, { out: 100 })
        await ok({ in: [100, 200, 300, 400], len: 2 }, { out: H(100, 200) })
        await ok({ in: [100, 200, 300, 400], len: 3 }, { out: H(H(100, 200), 300) })
        await ok({ in: [100, 200, 300, 400], len: 4 }, { out: H(H(H(100, 200), 300), 400) })

        await fail({ in: [100, 200, 300, 400], len: 5 })
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

describe("LeadingOnes", () => {
    it("LeadingOnes: N = 4", async () => {
        const { ok, fail } = await utils("LeadingOnes", [4])
        await ok({ len: 0 }, { out: [0, 0, 0, 0] })
        await ok({ len: 1 }, { out: [1, 0, 0, 0] })
        await ok({ len: 2 }, { out: [1, 1, 0, 0] })
        await ok({ len: 3 }, { out: [1, 1, 1, 0] })
        await ok({ len: 4 }, { out: [1, 1, 1, 1] })
        await fail({ len: 5 })
    })
    it("LeadingOnes: N = 2", async () => {
        const { ok, fail } = await utils("LeadingOnes", [2])
        await ok({ len: 0 }, { out: [0, 0] })
        await ok({ len: 1 }, { out: [1, 0] })
        await ok({ len: 2 }, { out: [1, 1] })
        await fail({ len: 3 })
    })
    it("LeadingOnes: N = 1", async () => {
        const { ok, fail } = await utils("LeadingOnes", [1])
        await ok({ len: 0 }, { out: [0] })
        await ok({ len: 1 }, { out: [1] })
        await fail({ len: 2 })
    })
})

describe("IncludeInPrefix", () => {
    it("IncludeInPrefix", async () => {
        const { ok, fail } = await utils("IncludeInPrefix", [4])
        await ok({ in: [8, 6, 10, 9], prefixLen: 2, v: 6 }, { out: 1 })
        await ok({ in: [8, 6, 10, 9], prefixLen: 2, v: 9 }, { out: 0 })
        await ok({ in: [8, 6, 10, 9], prefixLen: 0, v: 8 }, { out: 0 })
        await ok({ in: [8, 6, 10, 9], prefixLen: 1, v: 8 }, { out: 1 })
        await ok({ in: [8, 6, 10, 9], prefixLen: 4, v: 9 }, { out: 1 })
        await ok({ in: [8, 6, 10, 9], prefixLen: 4, v: 42 }, { out: 0 })

        await fail({ in: [8, 6, 10, 9], prefixLen: 5, v: 8 })

        const _in = [8, 6, 10, 9]
        for (let prefixLen = 0; prefixLen <= _in.length; prefixLen += 1) {
            for (const v of _in) {
                const out = _in.slice(0, prefixLen).includes(v) ? 1 : 0
                await ok({ in: _in, prefixLen, v }, { out })
            }
            await ok({ in: _in, prefixLen, v: 4242 }, { out: 0 })
        }
    })
})

describe("CheckMerkleProofAndComputeRoot", () => {
    it("CheckMerkleProofAndComputeRoot", async () => {
        const { ok, fail } = await utils("CheckMerkleProofAndComputeRoot", [5, 4])

        const digest = (vs: (number | bigint)[]) => vs.reduce((acc, v) => poseidon2([acc, v]))
        // let H = 5
        // let W = 4
        let childrens = []
        childrens[0] = [3, 4, 5, 6]
        childrens[1] = [2, digest(childrens[0]), 4, 8]
        childrens[2] = [5, 9, 7, digest(childrens[1])]
        childrens[3] = [7, 6, digest(childrens[2]), 0]
        await ok({ childrens, rootLv: 4, leaf: 3 }, { root: digest(childrens[3]) })
        await ok({ childrens, rootLv: 4, leaf: 4 }, { root: digest(childrens[3]) })
        await ok({ childrens, rootLv: 4, leaf: 5 }, { root: digest(childrens[3]) })
        await ok({ childrens, rootLv: 4, leaf: 6 }, { root: digest(childrens[3]) })
        await fail({ childrens, rootLv: 4, leaf: 2 }) // non exist leaf
        await fail({ childrens, rootLv: 5, leaf: 3 }) // level should <= 5 - 1
        childrens[2][1] = 42 // break the proof
        await fail({ childrens, rootLv: 4, leaf: 6 })

        childrens = []
        childrens[0] = [3, 4, 5, 6]
        childrens[1] = [2, digest(childrens[0]), 4, 8]
        childrens[2] = [5, 9, 7, digest(childrens[1])]
        childrens[3] = [0, 0, 0, 0]
        await ok({ childrens, rootLv: 3, leaf: 3 }, { root: digest(childrens[2]) })
        await ok({ childrens, rootLv: 3, leaf: 4 }, { root: digest(childrens[2]) })
        await ok({ childrens, rootLv: 3, leaf: 5 }, { root: digest(childrens[2]) })
        await ok({ childrens, rootLv: 3, leaf: 6 }, { root: digest(childrens[2]) })
        childrens[3] = [8, 9, 10, 11] // don't care
        await ok({ childrens, rootLv: 3, leaf: 3 }, { root: digest(childrens[2]) })

        childrens = []
        childrens[0] = [3, 4, 5, 6]
        childrens[1] = [0, 0, 0, 0]
        childrens[2] = [0, 0, 0, 0]
        childrens[3] = [0, 0, 0, 0]
        await ok({ childrens, rootLv: 1, leaf: 3 }, { root: digest(childrens[0]) })
        await ok({ childrens, rootLv: 1, leaf: 4 }, { root: digest(childrens[0]) })
        await ok({ childrens, rootLv: 1, leaf: 5 }, { root: digest(childrens[0]) })
        await ok({ childrens, rootLv: 1, leaf: 6 }, { root: digest(childrens[0]) })
        childrens[1] = [8, 9, 10, 11] // don't care
        await ok({ childrens, rootLv: 1, leaf: 3 }, { root: digest(childrens[0]) })

        childrens = []
        childrens[0] = [3, 4, 5, 6] // don't care
        childrens[1] = [0, 1, 2, 0]
        childrens[2] = [0, 3, 4, 0]
        childrens[3] = [0, 0, 0, 0]
        await ok({ childrens, rootLv: 0, leaf: 42 }, { root: 42 })
    }) // long-running test
})

function increaseLevelLengthArray(levelLengthArray: number[], W: number) {
    for (let lv = 0; ; lv += 1) {
        levelLengthArray[lv] += 1
        if (levelLengthArray[lv] <= W) {
            return
        }
        levelLengthArray[lv] = 1
    }
}
describe("ComputeDataHeightAndLevelLengthArray", () => {
    it("ComputeDataHeightAndLevelLengthArray", async () => {
        const H = 3
        const W = 4
        const bitsPerLevel = 4
        const { ok } = await utils("ComputeDataHeightAndLevelLengthArray", [H, W, bitsPerLevel])
        const capacity = (W * (W ** H - 1)) / (W - 1)

        const levelLengthArray = Array(H).fill(0)
        let levelLengths = 0
        let dataHeight = 0
        await ok({ levelLengths }, { dataHeight, levelLengthArray })
        for (let i = 0; i < capacity; i += 1) {
            increaseLevelLengthArray(levelLengthArray, W)
            dataHeight = levelLengthArray.filter((x) => x).length
            levelLengths = levelLengthArray.reduce((acc, v, lv) => acc | (v << (lv * bitsPerLevel)), 0)
            await ok({ levelLengths }, { dataHeight, levelLengthArray })
        }
    })
})

describe("LazyTowerHashChain", () => {
    it("LazyTowerHashChain W = 3", async () => {
        const H = 4
        const W = 3
        const bitsPerLevel = 4
        const { ok } = await utils("LazyTowerHashChain", [H, W, bitsPerLevel])

        const pb = LazyTowerHashChainProofBuilder(H, W)

        for (let i = BigInt(0); i < 13; i += BigInt(1)) {
            pb.add(i)
            for (let j = BigInt(0); j < i; j += BigInt(1)) {
                const proof = pb.build(pb.indexOf(j))
                await ok(proof, {})
            }
        }
    }) // long-running test

    it("LazyTowerHashChain W = 2", async () => {
        const H = 3
        const W = 2
        const bitsPerLevel = 4
        const { ok } = await utils("LazyTowerHashChain", [H, W, bitsPerLevel])

        const pb = LazyTowerHashChainProofBuilder(H, W)

        for (let i = BigInt(0); i < 14; i += BigInt(1)) {
            pb.add(i)
            for (let j = BigInt(0); j < i; j += BigInt(1)) {
                const proof = pb.build(pb.indexOf(j))
                await ok(proof, {})
            }
        }
    }) // long-running test

    it("LazyTowerHashChain W = 2, H = 2", async () => {
        const H = 2
        const W = 2
        const bitsPerLevel = 4
        const { ok } = await utils("LazyTowerHashChain", [H, W, bitsPerLevel])

        const pb = LazyTowerHashChainProofBuilder(H, W)

        for (let i = BigInt(0); i < 6; i += BigInt(1)) {
            pb.add(i)
            for (let j = BigInt(0); j < i; j += BigInt(1)) {
                const proof = pb.build(pb.indexOf(j))
                await ok(proof, {})
            }
        }
    }) // long-running test
})
