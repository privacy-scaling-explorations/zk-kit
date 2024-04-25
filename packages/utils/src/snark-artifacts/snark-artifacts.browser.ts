import { BigNumber, SnarkArtifacts, Version } from "../types"

export default async function maybeGetSnarkArtifacts(
    projectName: string,
    options: {
        parameters?: (BigNumber | number)[]
        version?: Version
        cdnUrl?: string
    } = {}
): Promise<SnarkArtifacts> {
    options.version ??= "latest"
    options.cdnUrl ??= "https://unpkg.com"

    const BASE_URL = `${options.cdnUrl}/@zk-kit/${projectName}-artifacts@${options.version}`
    const parameters = options.parameters ? `-${options.parameters.join("-")}` : ""

    return {
        wasm: `${BASE_URL}/${projectName}${parameters}.wasm`,
        zkey: `${BASE_URL}/${projectName}${parameters}.zkey`
    }
}
