export interface HashFunction {
    update(data: Buffer): HashFunction
    digest(): Buffer
}
