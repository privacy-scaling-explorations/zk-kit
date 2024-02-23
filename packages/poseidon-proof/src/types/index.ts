import { NumericString } from "snarkjs"
import { PackedProof } from "@zk-kit/utils"

export type SnarkArtifacts = {
    wasmFilePath: string
    zkeyFilePath: string
}

export type PoseidonProof = {
    scope: NumericString
    digest: NumericString
    proof: PackedProof
}
