import { Contract } from "ethers"
import { task, types } from "hardhat/config"

task("deploy:iqt-test", "Deploy an IncrementalQuinTreeTest contract")
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers }): Promise<Contract> => {
        const PoseidonT6Factory = await ethers.getContractFactory("PoseidonT6")
        const PoseidonT6 = await PoseidonT6Factory.deploy()

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
