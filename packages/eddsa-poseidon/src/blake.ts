// @ts-ignore
import { Blake512 } from "blake-hash/lib"
import { int2hex, isHexadecimal } from "./utils"

/**
 *
 */
export default function hash(data: number | bigint | string | Buffer): Buffer {
    if (
        typeof data !== "number" &&
        typeof data !== "bigint" &&
        typeof data !== "string" &&
        typeof data !== "object" &&
        !Buffer.isBuffer(data)
    ) {
        throw new TypeError("Data must be a number, a big number, a string or a buffer")
    }

    const engine = new Blake512()

    if (typeof data === "number" || typeof data === "bigint") {
        data = int2hex(BigInt(data))

        data = Buffer.from(data, "hex")
    }

    if (typeof data === "string" && isHexadecimal(data)) {
        data = Buffer.from(data.slice(2), "hex")
    }

    if (!Buffer.isBuffer(data)) {
        data = Buffer.from(data)
    }

    engine.update(data)

    return engine.digest()
}
