import { WitnessTester } from "circomkit"
import { deriveSecretScalar } from "@zk-kit/eddsa-poseidon"

import { circomkit, genEcdhSharedKey, genPublicKey, genRandomBabyJubValue } from "./common"

describe("ECDH Shared Key derivation circuit", () => {
    let circuit: WitnessTester<["privateKey", "publicKey"], ["sharedKey"]>

    before(async () => {
        circuit = await circomkit.WitnessTester("ecdh", {
            file: "ecdh",
            template: "Ecdh"
        })
    })

    it("should correctly compute an ECDH shared key", async () => {
        const privateKey1 = genRandomBabyJubValue()
        const privateKey2 = genRandomBabyJubValue()
        const publicKey2 = genPublicKey(privateKey2)

        // generate a shared key between the first private key and the second public key
        const ecdhSharedKey = genEcdhSharedKey(privateKey1, publicKey2)

        const circuitInputs = {
            privateKey: BigInt(deriveSecretScalar(privateKey1)),
            publicKey: publicKey2
        }

        await circuit.expectPass(circuitInputs, { sharedKey: [ecdhSharedKey[0], ecdhSharedKey[1]] })
    })

    it("should generate the same shared key from the same keypairs", async () => {
        const privateKey1 = genRandomBabyJubValue()
        const privateKey2 = genRandomBabyJubValue()
        const publicKey1 = genPublicKey(privateKey1)
        const publicKey2 = genPublicKey(privateKey2)

        // generate a shared key between the first private key and the second public key
        const ecdhSharedKey = genEcdhSharedKey(privateKey1, publicKey2)
        const ecdhSharedKey2 = genEcdhSharedKey(privateKey2, publicKey1)

        const circuitInputs = {
            privateKey: BigInt(deriveSecretScalar(privateKey1)),
            publicKey: publicKey2
        }

        const circuitInputs2 = {
            privateKey: BigInt(deriveSecretScalar(privateKey2)),
            publicKey: publicKey1
        }

        // calculate first time witness and check contraints
        const witness = await circuit.calculateWitness(circuitInputs)
        await circuit.expectConstraintPass(witness)

        const out = await circuit.readWitnessSignals(witness, ["sharedKey"])
        await circuit.expectPass(circuitInputs, { sharedKey: ecdhSharedKey })
        await circuit.expectPass(circuitInputs2, { sharedKey: out.sharedKey })
        await circuit.expectPass(circuitInputs2, { sharedKey: ecdhSharedKey2 })
    })

    it("should generate the same ECDH key consistently for the same inputs", async () => {
        const privateKey1 = BigInt(deriveSecretScalar(genRandomBabyJubValue()))
        const privateKey2 = genRandomBabyJubValue()
        const publicKey2 = genPublicKey(privateKey2)

        const circuitInputs = {
            privateKey: privateKey1,
            publicKey: publicKey2
        }

        // calculate first time witness and check contraints
        const witness = await circuit.calculateWitness(circuitInputs)
        await circuit.expectConstraintPass(witness)

        // read out
        const out = await circuit.readWitnessSignals(witness, ["sharedKey"])

        // calculate again
        await circuit.expectPass(circuitInputs, { sharedKey: out.sharedKey })
    })
})
