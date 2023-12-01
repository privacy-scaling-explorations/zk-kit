// @ts-ignore
import { Blake512 } from "blake-hash/lib"

export default function hash(data: any, encoding?: BufferEncoding) {
    const engine = new Blake512()

    if (!Buffer.isBuffer(data) && typeof data !== "string") {
        throw new TypeError("Data must be a string or a buffer")
    }

    if (!Buffer.isBuffer(data)) {
        data = Buffer.from(data, encoding)
    }

    engine.update(data)

    let digest = engine.digest()

    if (encoding !== undefined) {
        digest = digest.toString(encoding)
    }

    return digest
}
