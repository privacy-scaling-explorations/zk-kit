/**
 * It throws a type error if the parameter value has not been defined.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
export function requireDefinedParameter(parameterValue: any, parameterName: string) {
    if (typeof parameterValue === "undefined") {
        throw new TypeError(`Parameter '${parameterName}' is not defined`)
    }
}

/**
 * It throws a type error if the parameter value is not a number.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
export function requireNumber(parameterValue: any, parameterName: string) {
    if (typeof parameterValue !== "number") {
        throw new TypeError(`Parameter '${parameterName}' is not a number`)
    }
}

/**
 * It throws a type error if the parameter value is not a function.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
export function requireFunction(parameterValue: any, parameterName: string) {
    if (typeof parameterValue !== "function") {
        throw new TypeError(`Parameter '${parameterName}' is not a function`)
    }
}

/**
 * It throws a type error if the parameter value is not an array.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
export function requireArray(parameterValue: any, parameterName: string) {
    if (typeof parameterValue !== "object" && !Array.isArray(parameterValue)) {
        throw new TypeError(`Parameter '${parameterName}' is not an array`)
    }
}
