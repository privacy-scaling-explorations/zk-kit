import { task, types } from "hardhat/config"
import { PoseidonT3, proxy } from "poseidon-solidity"

task("deploy:imt-test", "Deploy an IMT contract for testing a library")
    .addParam<string>("library", "The name of the library", undefined, types.string)
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, library: libraryName }, { ethers }): Promise<any> => {
        // Deterministically deploy PoseidonT3.
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

        const LibraryFactory = await ethers.getContractFactory(libraryName, {
            libraries: {
                PoseidonT3: PoseidonT3.address
            }
        })
        const library = await LibraryFactory.deploy()

        await library.deployed()

        if (logs) {
            console.info(`${libraryName} library has been deployed to: ${library.address}`)
        }

        const ContractFactory = await ethers.getContractFactory(`${libraryName}Test`, {
            libraries: {
                [libraryName]: library.address
            }
        })

        const contract = await ContractFactory.deploy()

        await contract.deployed()

        if (logs) {
            console.info(`${libraryName}Test contract has been deployed to: ${contract.address}`)
        }

        return { library, contract }
    })
