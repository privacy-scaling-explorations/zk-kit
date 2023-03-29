import { expect } from "chai"
import { Contract } from "ethers"
import { ethers, run } from "hardhat"
import { poseidon } from "circomlibjs"

/* eslint-disable jest/valid-expect */
describe("HashTowerTest", () => {
    let contract: Contract

    const hashTowerId = ethers.utils.formatBytes32String("tower1")

    before(async () => {
        contract = await run("deploy:ht-test", { logs: false })
    })

    it("Should produce correct count, digests and digest of digests", async () => {
        const N = 150
        for (let i = 0; i < N; i++) {
            const transaction = contract.add(hashTowerId, i)
            await transaction
        }
        const [count, digests, digestOfDigests] = await contract.getDataForProving(hashTowerId);

        expect(count).to.equal(N);

        expect(digests[0]).to.equal(BigInt("7484852499570635450337779587061833141700590058395918107227385307780465498841"))
        expect(digests[1]).to.equal(BigInt("18801712394745483811033456933953954791894699812924877968490149877093764724813"))
        expect(digests[2]).to.equal(BigInt("18495397265763935736123111771752209927150052777598404957994272011704245682779"))
        expect(digests[3]).to.equal(BigInt("11606235313340788975553986881206148975708550071371494991713397040288897077102"))
        for (let i = 4; i < digests.length; i++) {
            expect(digests[i]).to.equal(BigInt("0"))
        }

        expect(digestOfDigests).to.equal(BigInt("19260615748091768530426964318883829655407684674262674118201416393073357631548"))
    })
})
