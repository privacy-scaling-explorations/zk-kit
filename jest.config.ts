import fs from "fs"
import type { Config } from "@jest/types"

const exclude = ["circuits", "imt.sol", "rollup-plugin-rust", "lazytower.sol", "lazytower.circom", "utils"]

const projects: any = fs
    .readdirSync("./packages", { withFileTypes: true })
    .filter((directory) => directory.isDirectory())
    .filter((directory) => !exclude.includes(directory.name))
    .map(({ name }) => ({
        preset: "ts-jest",
        rootDir: `packages/${name}`,
        displayName: name,
        moduleNameMapper: {
            "@zk-kit/(.*)": "<rootDir>/../$1/src/index.ts" // Interdependency packages.
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
