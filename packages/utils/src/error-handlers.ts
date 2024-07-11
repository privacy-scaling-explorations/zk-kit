/**
 * @module ErrorHandlers
 * This module is designed to provide utility functions for validating
 * function parameters. It includes functions that throw type errors if
 * the parameters do not meet specified criteria, such as being defined,
 * a number, a string, a function, or an array. This module helps ensure
 * that functions receive the correct types of inputs, enhancing code
 * reliability and reducing runtime errors.
 */

import {
    SupportedType,
    isArray,
    isBigInt,
    isBigNumber,
    isBigNumberish,
    isBuffer,
    isDefined,
    isFunction,
    isHexadecimal,
    isNumber,
    isObject,
    isString,
    isStringifiedBigInt,
    isSupportedType,
    isType,
    isUint8Array
} from "./type-checks"

/**
 * @throws Throws a type error if the parameter value has not been defined.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
export function requireDefined(parameterValue: any, parameterName: string) {
    if (!isDefined(parameterValue)) {
        throw new TypeError(`Parameter '${parameterName}' is not defined`)
    }
}

/**
 * @throws Throws a type error if the parameter value is not a number.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
export function requireNumber(parameterValue: number, parameterName: string) {
    if (!isNumber(parameterValue)) {
        throw new TypeError(`Parameter '${parameterName}' is not a number, received type: ${typeof parameterValue}`)
    }
}

/**
 * @throws Throws a type error if the parameter value is not a string.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
export function requireString(parameterValue: string, parameterName: string) {
    if (!isString(parameterValue)) {
        throw new TypeError(`Parameter '${parameterName}' is not a string, received type: ${typeof parameterValue}`)
    }
}

/**
 * @throws Throws a type error if the parameter value is not a function.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
export function requireFunction(parameterValue: Function, parameterName: string) {
    if (!isFunction(parameterValue)) {
        throw new TypeError(`Parameter '${parameterName}' is not a function, received type: ${typeof parameterValue}`)
    }
}

/**
 * @throws Throws a type error if the parameter value is not an Array.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
export function requireArray(parameterValue: any[], parameterName: string) {
    if (!isArray(parameterValue)) {
        throw new TypeError(`Parameter '${parameterName}' is not an Array instance`)
    }
}

/**
 * @throws Throws a type error if the parameter value is not a Uint8Array.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
export function requireUint8Array(parameterValue: Uint8Array, parameterName: string) {
    if (!isUint8Array(parameterValue)) {
        throw new TypeError(`Parameter '${parameterName}' is not a Uint8Array instance`)
    }
}

/**
 * @throws Throws a type error if the parameter value is not a Buffer.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
export function requireBuffer(parameterValue: Buffer, parameterName: string) {
    if (!isBuffer(parameterValue)) {
        throw new TypeError(`Parameter '${parameterName}' is not a Buffer instance`)
    }
}

/**
 * @throws Throws a type error if the parameter value is not an object.
 * Please, note that arrays are also objects in JavaScript.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
export function requireObject(parameterValue: object, parameterName: string) {
    if (!isObject(parameterValue)) {
        throw new TypeError(`Parameter '${parameterName}' is not an object, received type: ${typeof parameterValue}`)
    }
}

/**
 * @throws Throws a type error if the parameter value is not a bigint.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
export function requireBigInt(parameterValue: bigint, parameterName: string) {
    if (!isBigInt(parameterValue)) {
        throw new TypeError(`Parameter '${parameterName}' is not a bigint, received type: ${typeof parameterValue}`)
    }
}

/**
 * @throws Throws a type error if the parameter value is not a stringified bigint.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
export function requireStringifiedBigInt(parameterValue: string, parameterName: string) {
    if (!isStringifiedBigInt(parameterValue)) {
        throw new TypeError(`Parameter '${parameterName}' is not a stringified bigint`)
    }
}

/**
 * @throws Throws a type error if the parameter value is not a hexadecimal string.
 * If 'prefix' is 'true', the string must start with '0x' or '0X' followed by one or more
 * hexadecimal digits (0-9, a-f, A-F), otherwise no prefix is expected. 'prefix' is optional and
 * if its value it is not explicitly defined it will be set to 'true' by default.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 * @param prefix A boolean to include or not a '0x' or '0X' prefix.
 */
export function requireHexadecimal(parameterValue: string, parameterName: string, prefix = true) {
    if (!isHexadecimal(parameterValue, prefix)) {
        throw new TypeError(`Parameter '${parameterName}' is not a hexadecimal string`)
    }
}

/**
 * @throws Throws a type error if the parameter value is not a bignumber.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
export function requireBigNumber(parameterValue: any, parameterName: string) {
    if (!isBigNumber(parameterValue)) {
        throw new TypeError(`Parameter '${parameterName}' is not a bignumber`)
    }
}

/**
 * @throws Throws a type error if the parameter value is not a bignumber-ish.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
export function requireBigNumberish(parameterValue: any, parameterName: string) {
    if (!isBigNumberish(parameterValue)) {
        throw new TypeError(`Parameter '${parameterName}' is not a bignumber-ish`)
    }
}

/**
 * @throws Throws a type error if the parameter value type is not part of the list of types.
 * @param parameterValue The parameter value.
 * @param parameterName The parameter name.
 */
export function requireTypes(parameterValue: any, parameterName: string, types: SupportedType[]) {
    for (const type of types) {
        if (!isSupportedType(type)) {
            throw new Error(`Type '${type}' is not supported`)
        }
    }

    for (const type of types) {
        if (isType(parameterValue, type)) {
            return
        }
    }

    throw new TypeError(`Parameter '${parameterName}' is none of the following types: ${types.join(", ")}`)
}
