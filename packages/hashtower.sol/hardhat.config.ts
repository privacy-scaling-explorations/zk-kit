import "@nomicfoundation/hardhat-toolbox"
import { config as dotenvConfig } from "dotenv"
import { HardhatUserConfig } from "hardhat/config"
import { resolve } from "path"
import { config } from "./package.json"
import "./tasks/deploy-ht-test"

dotenvConfig({ path: resolve(__dirname, "./.env") })

const hardhatConfig: HardhatUserConfig = {
    solidity: {
        version: "0.8.18",
        settings: {
            optimizer: {
                enabled: true,
                runs: 2 ** 32 - 1
            }
        }
    },
    paths: {
        sources: config.paths.contracts,
        tests: config.paths.tests,
        cache: config.paths.cache,
        artifacts: config.paths.build
    },
    gasReporter: {
        currency: "USD",
        enabled: process.env.REPORT_GAS === "true",
        coinmarketcap: process.env.COINMARKETCAP_API_KEY
    }
}

export default hardhatConfig
