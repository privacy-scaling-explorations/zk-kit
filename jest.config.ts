import fs from "fs"
import type { Config } from "@jest/types"

const exclude = ["circuits", "imt.sol", "rollup-plugin-rust", "lazytower.sol", "lazytower.circom"]

const projects: any = fs
    .readdirSync("./packages", { withFileTypes: true })
    .filter((directory) => directory.isDirectory())
    .filter((directory) => !exclude.includes(directory.name))
    .map(({ name }) => ({
        preset: "ts-jest",
        rootDir: `packages/${name}`,
        displayName: name,
        moduleNameMapper: {
            "@zk-kit/(.*)/(.*)": ["<rootDir>/../$1/src/$2.ts", "<rootDir>/../$1/src/$2/$2.node.ts"],
            "@zk-kit/(.*)": "<rootDir>/../$1/src/index.ts"
        }
    }))

export default async (): Promise<Config.InitialOptions> => ({
    projects,
    verbose: true,
    coverageDirectory: "./coverage/libraries",
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 95,
            lines: 95,
            statements: 95
        }
    }
})
