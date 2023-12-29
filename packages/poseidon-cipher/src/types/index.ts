import { BigNumber } from "@zk-kit/utils"

export type CipherText<N = BigNumber> = N[]
export type PlainText<N = BigNumber> = N[]
export type EncryptionKey<N = BigNumber> = [N, N]
export type Nonce<N = BigNumber> = N
export type StringifiedInput =
    | string
    | string[]
    | string[][]
    | string[][][]
    | { [key: string]: StringifiedInput }
    | null
export type BigIntOutput =
    | BigIntOutput[]
    | StringifiedInput
    | bigint
    | bigint[]
    | bigint[][]
    | bigint[][][]
    | { [key: string]: bigint }
    | null
