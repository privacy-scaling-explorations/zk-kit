import { readFileSync, writeFileSync } from "node:fs"

async function main() {
    const projectName = process.argv[2]
    if (!projectName) {
        console.error("Please specify the project name as the second argument.")
        process.exit(1)
    }

    const projectDirectory = `packages/${projectName}`
    const filePath = `${projectDirectory}/package.json`

    try {
        const content = JSON.parse(readFileSync(filePath, "utf8"))

        if (content.stableVersion) {
            delete content.stableVersion
        }

        writeFileSync(filePath, JSON.stringify(content, null, 4), "utf8")
        console.log(`Successfully updated ${filePath}`)
    } catch (error) {
        console.error("Error reading or writing the file:", error)
        process.exit(1)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
