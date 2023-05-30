import { Contract } from "ethers"
import { task, types } from "hardhat/config"

task("deploy:lmt-test", "Deploy a LazyMerkleTree contract")
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers }): Promise<Contract> => {
        const PoseidonT3Factory = await ethers.getContractFactory("PoseidonT3")
        const PoseidonT3 = await PoseidonT3Factory.deploy()

        if (logs) {
            console.info(`PoseidonT3 library has been deployed to: ${PoseidonT3.address}`)
        }

        const LazyMerkleTreeFactory = await ethers.getContractFactory("LazyMerkleTree", {
            libraries: {
                PoseidonT3: PoseidonT3.address
            }
        })
        const lazyMerkleTree = await LazyMerkleTreeFactory.deploy()

        await lazyMerkleTree.deployed()

        if (logs) {
            console.info(`LazyMerkleTree library has been deployed to: ${lazyMerkleTree.address}`)
        }

        const ContractFactory = await ethers.getContractFactory("LazyMerkleTreeTest", {
            libraries: {
                LazyMerkleTree: lazyMerkleTree.address
            }
        })

        const contract = await ContractFactory.deploy()

        await contract.deployed()

        if (logs) {
            console.info(`Test contract has been deployed to: ${contract.address}`)
        }
        return { lazyMerkleTree, contract }
    })
