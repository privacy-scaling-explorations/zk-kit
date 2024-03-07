import { Blake512 } from "../src"

describe("Blake512", () => {
    const emptyHash =
        "a8cfbbd73726062df0c6864dda65defe58ef0cc52a5625090fa17601e1eecd1b628e94f396ae402a00acc9eab77b4d4c2e852aaaa25a636d80af3fc7913ef5b8"
    // 679bbbffcbde6ebcc7fdf78d8985a8c58402a4f972bc5843e3e8bd2f7b0992e976c0cd3837edcb68dca379f96c492c0b44349a9d96b4748f0c1ca157b78de50f from blake-hash lib.
    const dummySentenceHash =
        "1f7e26f63b6ad25a0896fd978fd050a1766391d2fd0471a77afb975e5034b7ad2d9ccf8dfb47abbbe656e1b82fbc634ba42ce186e8dc5e1ce09a885d41f43451"

    it("Should correctly hash an empty string", () => {
        const blake = new Blake512()
        const hash = blake.update(Buffer.from("")).digest().toString("hex")

        expect(hash).toBe(emptyHash)
    })

    it("Should correctly hash non-empty data", () => {
        const blake = new Blake512()
        const data = Buffer.from("The quick brown fox jumps over the lazy dog")
        const hash = blake.update(data).digest().toString("hex")

        expect(hash).toBe(dummySentenceHash)
    })

    it("Should support incremental updates", () => {
        const blake = new Blake512()

        blake.update(Buffer.from("The quick brown "))
        blake.update(Buffer.from("fox jumps over "))
        blake.update(Buffer.from("the lazy dog"))

        const hash = blake.digest().toString("hex")

        expect(hash).toBe(dummySentenceHash)
    })
})
