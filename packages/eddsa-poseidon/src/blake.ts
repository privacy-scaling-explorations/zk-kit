// @ts-ignore
import { Blake512 } from "blake-hash/lib"

export default function hash(message: Buffer): Buffer {
    const engine = new Blake512()

    engine.update(message)

    return engine.digest()
}
