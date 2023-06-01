import { Contract } from "ethers"
import { task, types } from "hardhat/config"
import { proxy, PoseidonT3 } from "poseidon-solidity"

task("deploy:lmt-test", "Deploy a LazyMerkleTree contract")
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers }): Promise<Contract> => {
        // deterministically deploy PoseidonT3
        const signer = await ethers.getSigner()
        if ((await ethers.provider.getCode(proxy.address)) === "0x") {
            await signer.sendTransaction({
                to: proxy.from,
                value: proxy.gas
            })
            await ethers.provider.sendTransaction(proxy.tx)
        }
        if ((await ethers.provider.getCode(PoseidonT3.address)) === "0x") {
            await signer.sendTransaction({
                to: proxy.address,
                data: PoseidonT3.data
            })
        }

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
