export function requireDefinedParameter(parameterValue: any, parameterName: string) {
    if (typeof parameterValue === "undefined") {
        throw new TypeError(`Parameter '${parameterName}' is not defined`)
    }
}

export function requireNumber(parameterValue: any, parameterName: string) {
    if (typeof parameterValue !== "number") {
        throw new TypeError(`Parameter '${parameterName}' is not a number`)
    }
}

export function requireFunction(parameterValue: any, parameterName: string) {
    if (typeof parameterValue !== "function") {
        throw new TypeError(`Parameter '${parameterName}' is not a function`)
    }
}

export function requireArray(parameterValue: any, parameterName: string) {
    if (typeof parameterValue !== "object" && !Array.isArray(parameterValue)) {
        throw new TypeError(`Parameter '${parameterName}' is not an array`)
    }
}
