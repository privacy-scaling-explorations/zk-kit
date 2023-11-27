export default function checkParameter(value: any, name: string, ...types: string[]) {
    if (value === undefined) {
        throw new TypeError(`Parameter '${name}' is not defined`)
    }

    if (!types.includes(typeof value)) {
        throw new TypeError(`Parameter '${name}' is none of these types: ${types.join(", ")}`)
    }
}
