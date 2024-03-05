import { WitnessTester } from "circomkit"
import { circomkit } from "./common"

describe("unpack-element", () => {
    let circuit: WitnessTester<["in"], ["out"]>

    it("Should unpack a field element with 3 / 4 / 5 packed values correctly", async () => {
        for (let n = 3; n <= 5; n += 1) {
            const elements: string[] = []

            circuit = await circomkit.WitnessTester("unpack-element", {
                file: "unpack-element",
                template: "UnpackElement",
                params: [n]
            })

            for (let i = 0; i < n; i += 1) {
                let e = (BigInt(i) % BigInt(2 ** 50)).toString(2)

                while (e.length < 50) {
                    e = `0${e}`
                }

                elements.push(e)
            }

            const INPUT = {
                in: BigInt(`0b${elements.join("")}`)
            }

            const witness = await circuit.calculateWitness(INPUT)
            await circuit.expectConstraintPass(witness)

            const outputs = [
                [BigInt(0), BigInt(1), BigInt(2)],
                [BigInt(0), BigInt(1), BigInt(2), BigInt(3)],
                [BigInt(0), BigInt(1), BigInt(2), BigInt(3), BigInt(4)]
            ]

            const OUTPUT = {
                out: outputs[n - 3]
            }

            await circuit.expectPass(INPUT, OUTPUT)
        }
    })
})
