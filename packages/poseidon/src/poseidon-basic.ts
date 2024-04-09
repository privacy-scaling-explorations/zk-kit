import { Field as Fp } from "@noble/curves/abstract/modular"
import { poseidon as _poseidon } from "@noble/curves/abstract/poseidon"
import type { Range } from "./types"

// Using recommended parameters from whitepaper https://eprint.iacr.org/2019/458.pdf (table 2, table 8).
const N_ROUNDS_F = 8
const N_ROUNDS_P = [56, 57, 56, 60, 60, 63, 64, 63, 60, 66, 60, 65, 70, 60, 64, 68]
const POWER = 5
const ALT_BN128_CURVE_ORDER = 21888242871839275222246405745257275088548364400416034343698204186575808495617n

export default function poseidonBasic(t: Range<1, 16>, roundConstants: bigint[][], mds: bigint[][]) {
    const roundsPartial = N_ROUNDS_P[t - 1]

    return _poseidon({
        Fp: Fp(ALT_BN128_CURVE_ORDER),
        t: t + 1,
        roundsFull: N_ROUNDS_F,
        roundsPartial,
        roundConstants,
        mds,
        sboxPower: POWER
    })
}
