export default function requireDefinedParameter(parameterValue: any, parameterName: string) {
    if (typeof parameterValue === "undefined") {
        throw new TypeError(`Parameter '${parameterName}' is not defined`)
    }
}
