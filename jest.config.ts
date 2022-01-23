import fs from "fs"
import type { Config } from "@jest/types"

const projects: any = fs
  .readdirSync("./packages", { withFileTypes: true })
  .filter((directory) => directory.isDirectory())
  .map(({ name }) => ({
    rootDir: `packages/${name}`,
    displayName: name,
    moduleNameMapper: {
      "@zk-kit/types": "<rootDir>/../../types/zk-kit/index.d.ts",
      "@zk-kit/(.*)": "<rootDir>/../$1/src/index.ts" // Interdependency packages.
    }
  }))

export default async (): Promise<Config.InitialOptions> => ({
  projects,
  verbose: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!<rootDir>/src/**/index.ts", "!<rootDir>/src/**/*.d.ts"],
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 30,
      lines: 30,
      statements: 30
    }
  }
})
