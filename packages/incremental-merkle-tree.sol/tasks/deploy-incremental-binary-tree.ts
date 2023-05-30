import { Contract } from "ethers"
import { task, types } from "hardhat/config"
import { proxy, PoseidonT3 } from "poseidon-solidity"

task("deploy:incremental-binary-tree-test", "Deploy an IncrementalBinaryTreeTest contract")
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

        const IncrementalBinaryTreeLibFactory = await ethers.getContractFactory("IncrementalBinaryTree", {
            libraries: {
                PoseidonT3: PoseidonT3.address
            }
        })
        const incrementalBinaryTreeLib = await IncrementalBinaryTreeLibFactory.deploy()

        await incrementalBinaryTreeLib.deployed()

        if (logs) {
            console.info(`IncrementalBinaryTree library has been deployed to: ${incrementalBinaryTreeLib.address}`)
        }

        const ContractFactory = await ethers.getContractFactory("BinaryTreeTest", {
            libraries: {
                IncrementalBinaryTree: incrementalBinaryTreeLib.address
            }
        })

        const contract = await ContractFactory.deploy()

        await contract.deployed()

        if (logs) {
            console.info(`Test contract has been deployed to: ${contract.address}`)
        }

        return contract
    })
