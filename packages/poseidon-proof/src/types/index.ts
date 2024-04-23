import { NumericString } from "snarkjs"
import { PackedGroth16Proof } from "@zk-kit/utils"

export type PoseidonProof = {
    scope: NumericString
    digest: NumericString
    proof: PackedGroth16Proof
}
