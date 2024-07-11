import type { Point } from "@zk-kit/baby-jubjub"
import type { BigNumber } from "@zk-kit/utils"

export type Signature<N = BigNumber> = {
    R8: Point<N>
    S: N
}
