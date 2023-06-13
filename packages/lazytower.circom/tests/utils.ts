// SEE: https://github.com/iden3/circuits/blob/a6aa4641f9b8736fab3e721be727701890d2a85e/test/comparators.test.ts
// SEE: https://github.com/iden3/circom_tester/blob/8e66758913331afd748213da53081942a2b5df4f/wasm/tester.js#L17
import { wasm as wasm_tester } from "circom_tester"
import { tmpName } from "tmp-promise"
import * as fs from "node:fs/promises"

interface CircomTester {
    calculateWitness: (input: any) => Promise<bigint[]>
    checkConstraints: (witness: bigint[]) => Promise<void>
    assertOut: (witness: bigint[], output: any) => Promise<void>
}

async function getTester(srcPath: string, templateName: string, args: number[], options: any): Promise<CircomTester> {
    const content = `
        pragma circom 2.1.4;
        include "${srcPath}";
        component main = ${templateName}(${args});`
    const mainFile = await tmpName()
    await fs.writeFile(mainFile, content)

    const tester = await wasm_tester(mainFile, options)
    await fs.unlink(mainFile)
    return tester
}

function getUtils(tester: CircomTester) {
    async function ok(input: any, output: any) {
        const witness = await tester.calculateWitness(input)
        await tester.checkConstraints(witness)
        await tester.assertOut(witness, output)
    }
    async function fail(input: any) {
        await expect(() => tester.calculateWitness(input)).rejects.toThrow()
    }
    return { ok, fail }
}

export { CircomTester, getTester, getUtils }
