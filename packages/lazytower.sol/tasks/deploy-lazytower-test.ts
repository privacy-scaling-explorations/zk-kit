import { Contract } from "ethers"
import { task, types } from "hardhat/config"

task("deploy:lazytower-test", "Deploy a LazyTowerHashChainTest contract")
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers }): Promise<Contract> => {
        const PoseidonT3Factory = await ethers.getContractFactory("PoseidonT3")
        const PoseidonT3 = await PoseidonT3Factory.deploy()

        if (logs) {
            console.info(`PoseidonT3 library has been deployed to: ${PoseidonT3.address}`)
        }

        const LazyTowerLibFactory = await ethers.getContractFactory("LazyTowerHashChain", {
            libraries: {
                PoseidonT3: PoseidonT3.address
            }
        })
        const lazyTowerLib = await LazyTowerLibFactory.deploy()

        await lazyTowerLib.deployed()

        if (logs) {
            console.info(`LazyTowerHashChain library has been deployed to: ${lazyTowerLib.address}`)
        }

        const ContractFactory = await ethers.getContractFactory("LazyTowerHashChainTest", {
            libraries: {
                LazyTowerHashChain: lazyTowerLib.address
            }
        })

        const contract = await ContractFactory.deploy()

        await contract.deployed()

        if (logs) {
            console.info(`Test contract has been deployed to: ${contract.address}`)
        }

        return contract
    })
