import { crypto } from "../src"

describe("crypto", () => {
    it("Should throw when size is zero", async () => {
        const fun = () => crypto.getRandomValues(0)

        expect(fun).toThrow("size 0 is too small, need at least 1")
    })
    it("Should correctly return a random value", async () => {
        expect(crypto.getRandomValues(1)).toBeDefined()
        expect(crypto.getRandomValues(2)).toBeDefined()
        expect(crypto.getRandomValues(32)).toBeDefined()
    })
})
