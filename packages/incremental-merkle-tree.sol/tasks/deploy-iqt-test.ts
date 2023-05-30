import { Contract } from "ethers"
import { task, types } from "hardhat/config"
import { proxy, PoseidonT6 } from "poseidon-solidity"

task("deploy:iqt-test", "Deploy an IncrementalQuinTreeTest contract")
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers }): Promise<Contract> => {
        // deterministically deploy PoseidonT6
        const signer = await ethers.getSigner()
        if ((await ethers.provider.getCode(proxy.address)) === "0x") {
            await signer.sendTransaction({
                to: proxy.from,
                value: proxy.gas
            })
            await ethers.provider.sendTransaction(proxy.tx)
        }
        if ((await ethers.provider.getCode(PoseidonT6.address)) === "0x") {
            await signer.sendTransaction({
                to: proxy.address,
                data: PoseidonT6.data
            })
        }

        if (logs) {
            console.info(`PoseidonT6 library has been deployed to: ${PoseidonT6.address}`)
        }

        const IncrementalQuinTreeLibFactory = await ethers.getContractFactory("IncrementalQuinTree", {
            libraries: {
                PoseidonT6: PoseidonT6.address
            }
        })
        const incrementalQuinTreeLib = await IncrementalQuinTreeLibFactory.deploy()

        await incrementalQuinTreeLib.deployed()

        if (logs) {
            console.info(`IncrementalQuinTree library has been deployed to: ${incrementalQuinTreeLib.address}`)
        }

        const ContractFactory = await ethers.getContractFactory("IncrementalQuinTreeTest", {
            libraries: {
                IncrementalQuinTree: incrementalQuinTreeLib.address
            }
        })

        const contract = await ContractFactory.deploy()

        await contract.deployed()

        if (logs) {
            console.info(`Test contract has been deployed to: ${contract.address}`)
        }

        return contract
    })
