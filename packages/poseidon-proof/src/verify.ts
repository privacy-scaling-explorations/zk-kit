import { verify as _verify } from "@zk-kit/groth16"
import unpackProof from "./unpackProof"
import verificationKey from "./verification-key.json"
import { PoseidonProof } from "./types"

/**
 */
export default function verify({ scope, hash, nullifier, proof }: PoseidonProof): Promise<boolean> {
    return _verify(verificationKey, {
        publicSignals: [scope, hash, nullifier],
        proof: unpackProof(proof)
    })
}
