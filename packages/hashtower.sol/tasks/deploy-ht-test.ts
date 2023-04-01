import { Contract } from "ethers"
import { task, types } from "hardhat/config"

task("deploy:ht-test", "Deploy a HashTowerTest contract")
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers }): Promise<Contract> => {
        const PoseidonT5Factory = await ethers.getContractFactory("PoseidonT5")
        const PoseidonT5 = await PoseidonT5Factory.deploy()

        if (logs) {
            console.info(`PoseidonT5 library has been deployed to: ${PoseidonT5.address}`)
        }

        const HashTowerLibFactory = await ethers.getContractFactory("HashTower", {
            libraries: {
                PoseidonT5: PoseidonT5.address
            }
        })
        const hashTowerLib = await HashTowerLibFactory.deploy()

        await hashTowerLib.deployed()

        if (logs) {
            console.info(`HashTower library has been deployed to: ${hashTowerLib.address}`)
        }

        const ContractFactory = await ethers.getContractFactory("HashTowerTest", {
            libraries: {
                HashTower: hashTowerLib.address
            }
        })

        const contract = await ContractFactory.deploy()

        await contract.deployed()

        if (logs) {
            console.info(`Test contract has been deployed to: ${contract.address}`)
        }

        return contract
    })
