export type ZKArtifact = string | Uint8Array

export type NumericString = `${number}` | string

export type SignalValueType = NumericString | number | bigint | SignalValueType[]

export interface CircuitSignals {
    [signal: string]: SignalValueType
}

export interface Groth16Proof {
    pi_a: NumericString[]
    pi_b: NumericString[][]
    pi_c: NumericString[]
    protocol: string
    curve: string
}

export type PublicSignals = NumericString[]
