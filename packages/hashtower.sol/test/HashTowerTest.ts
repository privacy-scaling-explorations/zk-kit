import { expect } from "chai"
import { Contract } from "ethers"
import { ethers, run } from "hardhat"
import HashTower from "./utils"

/* eslint-disable jest/valid-expect */
describe("HashTowerTest", () => {
    let contract: Contract

    before(async () => {
        contract = await run("deploy:ht-test", { logs: false })
    })

    it("Should produce correct root", async () => {
        const hashTowerId = ethers.utils.formatBytes32String("test1")
        const tower = new HashTower(24)

        const N = 150
        for (let i = 0; i < N; i += 1) {
            await contract.add(hashTowerId, i).then((t) => t.wait())
            tower.add(BigInt(i))
        }

        expect(tower.root.toString()).to.equal((await contract.root(hashTowerId)).toString())
    })

    it("Should benchmark add", async () => {
        const hashTowerId = ethers.utils.formatBytes32String("test2")

        const N = 500
        const gas = []
        for (let i = 0; i < N; i += 1) {
            const g = await contract.callStatic.addBenchmark(hashTowerId, i)
            gas.push(BigInt(g))
        }
        const averageCost = gas.reduce((acc, val) => acc + val, 0n) / BigInt(N)
        console.log(`Average insertion cost: ${averageCost}`)
        expect(0).to.equal(0)
    })
})
