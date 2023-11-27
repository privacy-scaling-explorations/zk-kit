import { task, types } from "hardhat/config"
import { PoseidonT3, PoseidonT6, proxy } from "poseidon-solidity"

task("deploy:imt-test", "Deploy an IMT contract for testing a library")
    .addParam<string>("library", "The name of the library", undefined, types.string)
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .addOptionalParam<number>("arity", "The arity of the tree", 2, types.int)
    .setAction(async ({ logs, library: libraryName, arity }, { ethers }): Promise<any> => {
        // Deterministically deploy Poseidon.
        const signer = await ethers.getSigner()
        const Poseidon = arity === 5 ? PoseidonT6 : PoseidonT3

        if ((await ethers.provider.getCode(proxy.address)) === "0x") {
            await signer.sendTransaction({
                to: proxy.from,
                value: proxy.gas
            })
            await ethers.provider.sendTransaction(proxy.tx)
        }

        if ((await ethers.provider.getCode(Poseidon.address)) === "0x") {
            await signer.sendTransaction({
                to: proxy.address,
                data: Poseidon.data
            })
        }

        if (logs) {
            console.info(`Poseidon library has been deployed to: ${Poseidon.address}`)
        }

        const LibraryFactory = await ethers.getContractFactory(libraryName, {
            libraries: {
                [`PoseidonT${arity + 1}`]: Poseidon.address
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
