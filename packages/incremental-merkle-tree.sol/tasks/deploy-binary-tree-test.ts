import { poseidon_gencontract as poseidonContract } from "circomlibjs"
import { Contract } from "ethers"
import { task, types } from "hardhat/config"

task("deploy:binary-tree-test", "Deploy a BinaryTreeTest contract")
  .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
  .setAction(async ({ logs }, { ethers }): Promise<Contract> => {
    const poseidonT3ABI = poseidonContract.generateABI(2)
    const poseidonT3Bytecode = poseidonContract.createCode(2)

    const [signer] = await ethers.getSigners()

    const PoseidonLibT3Factory = new ethers.ContractFactory(poseidonT3ABI, poseidonT3Bytecode, signer)
    const poseidonT3Lib = await PoseidonLibT3Factory.deploy()

    await poseidonT3Lib.deployed()

    if (logs) {
      console.info(`PoseidonT3 library has been deployed to: ${poseidonT3Lib.address}`)
    }

    const IncrementalBinaryTreeLibFactory = await ethers.getContractFactory("IncrementalBinaryTree", {
      libraries: {
        PoseidonT3: poseidonT3Lib.address
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
