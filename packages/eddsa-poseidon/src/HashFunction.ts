import { Buffer } from "buffer"

export interface HashFunction {
    update(data: Buffer): HashFunction
    digest(): Buffer
}
