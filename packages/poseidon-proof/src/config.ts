import pkg from "../package.json"

export const libraryName = pkg.name.split("/")[1]

export const defaultSnarkArtifacts = {
    wasmFilePath: "https://zkkit.cedoor.dev/poseidon-proof.wasm",
    zkeyFilePath: "https://zkkit.cedoor.dev/poseidon-proof.zkey"
}
