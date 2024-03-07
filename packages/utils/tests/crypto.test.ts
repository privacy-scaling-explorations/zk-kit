import { cryptoNode, cryptoBrowser } from "../src"

describe("crypto", () => {
    describe("node", () => {
        it("Should throw when size is zero", async () => {
            const fun = () => cryptoNode.getRandomValue(0)

            expect(fun).toThrow("size 0 is too small, need at least 1")
        })
        it("Should correctly return a random value", async () => {
            expect(cryptoNode.getRandomValue(1)).toBeDefined()
            expect(cryptoNode.getRandomValue(2)).toBeDefined()
            expect(cryptoNode.getRandomValue(32)).toBeDefined()
        })
    })

    describe("browser", () => {
        it("Should throw when size is zero", async () => {
            const fun = () => cryptoBrowser.getRandomValue(0)

            expect(fun).toThrow("size 0 is too small, need at least 1")
        })
        it("Should correctly return a random value", async () => {
            expect(cryptoBrowser.getRandomValue(1)).toBeDefined()
            expect(cryptoBrowser.getRandomValue(2)).toBeDefined()
            expect(cryptoBrowser.getRandomValue(32)).toBeDefined()
        })
    })
})
