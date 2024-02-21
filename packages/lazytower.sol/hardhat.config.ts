import "@nomicfoundation/hardhat-toolbox"
import { HardhatUserConfig } from "hardhat/config"
import "./tasks/deploy-lazytower-test"

const hardhatConfig: HardhatUserConfig = {
    solidity: "0.8.23",
    gasReporter: {
        currency: "USD",
        enabled: process.env.REPORT_GAS === "true",
        coinmarketcap: process.env.COINMARKETCAP_API_KEY
    },
    typechain: {
        target: "ethers-v6"
    }
}

export default hardhatConfig
