/**
 * @module TypeChecks
 * This module provides utility functions to check data types.
 * It defines a set of supported types and includes functions to check if
 * a value is defined and if it matches a supported type. These functions
 * are useful for type checking and validation in the other libraries,
 * enhancing code robustness and reliability.
 */

// The list of types supported by this utility functions.
const supportedTypes = [
    "number",
    "string",
    "function",
    "array",
    "uint8array",
    "object",
    "bigint",
    "stringified-bigint",
    "hexadecimal",
    "bignumberish"
] as const

// Type extracted from the list above.
export type SupportedType = (typeof supportedTypes)[number]

/**
 * Returns true if the value is defined, false otherwise.
 * @param value The value to be checked.
 */
export function isDefined(value: any): boolean {
    return typeof value !== "undefined"
}

/**
 * Returns true if the value is a number, false otherwise.
 * @param value The value to be checked.
 */
export function isNumber(value: any): boolean {
    return typeof value === "number"
}

/**
 * Returns true if the value is a string, false otherwise.
 * @param value The value to be checked.
 */
export function isString(value: any): boolean {
    return typeof value === "string"
}

/**
 * Returns true if the value is a function, false otherwise.
 * @param value The value to be checked.
 */
export function isFunction(value: any): boolean {
    return typeof value === "function"
}

/**
 * Returns true if the value is an array, false otherwise.
 * @param value The value to be checked.
 */
export function isArray(value: any): boolean {
    return typeof value === "object" && Array.isArray(value)
}

/**
 * Returns true if the value is a uint8array, false otherwise.
 * @param value The value to be checked.
 */
export function isUint8Array(value: any): boolean {
    return value instanceof Uint8Array
}

/**
 * Returns true if the value is an object, false otherwise.
 * @param value The value to be checked.
 */
export function isObject(value: any): boolean {
    return typeof value === "object"
}

/**
 * Returns true if the value is a bigint, false otherwise.
 * @param value The value to be checked.
 */
export function isBigInt(value: any): boolean {
    return typeof value === "bigint"
}

/**
 * Checks if the given value is a string that represents a valid bigint.
 * @param value The value to be checked if it's a stringified bigint.
 */
export function isStringifiedBigInt(value: any): boolean {
    // Check if value is a string first.
    if (!isString(value)) {
        return false
    }

    try {
        // Attempt to convert the string to BigInt.
        BigInt(value)

        return true
    } catch {
        return false
    }
}

/**
 * Checks if a string is a valid hexadecimal representation.
 * The string must start with '0x' or '0X' followed by one or more hexadecimal digits (0-9, a-f, A-F).
 * @param value The string to be tested.
 */
export function isHexadecimal(value: any) {
    return /^(0x|0X)[0-9a-fA-F]+$/.test(value)
}

/**
 * Checks if the given value can be considered as "BigNumber-ish".
 * A value is considered "BigNumber-ish" if it meets
 * any of the following conditions: it's a number, a bigint, a string
 * that can be converted to a bigint, a hexadecimal
 * string, or a Buffer object.
 * @param value The value to check.
 */
export function isBigNumberish(value: any): boolean {
    return (
        isNumber(value) ||
        isBigInt(value) ||
        isStringifiedBigInt(value) ||
        isHexadecimal(value) ||
        Buffer.isBuffer(value)
    )
}

/**
 * Returns true if the value type is the same as the type passed
 * as the second parameter, false otherwise.
 * @param type The expected type.
 */
export function isType(value: any, type: SupportedType): boolean {
    switch (type) {
        case "number":
            return isNumber(value)
        case "string":
            return isString(value)
        case "function":
            return isFunction(value)
        case "array":
            return isArray(value)
        case "uint8array":
            return isUint8Array(value)
        case "object":
            return isObject(value)
        case "bigint":
            return isBigInt(value)
        case "stringified-bigint":
            return isStringifiedBigInt(value)
        case "hexadecimal":
            return isHexadecimal(value)
        case "bignumberish":
            return isBigNumberish(value)
        default:
            return false
    }
}

/**
 * Returns true if the type is being supported by this utility
 * functions, false otherwise.
 * @param type The type to be checked.
 */
export function isSupportedType(type: string): type is SupportedType {
    return (supportedTypes as readonly string[]).includes(type)
}
