import {
    requireArray,
    requireBigInt,
    requireBigNumberish,
    requireDefined,
    requireFunction,
    requireHexadecimal,
    requireNumber,
    requireObject,
    requireString,
    requireStringifiedBigInt,
    requireTypes,
    requireUint8Array
} from "../src"

describe("# error-handlers", () => {
    it("Should throw an error if the parameter is not defined", () => {
        const fun = () => requireDefined(undefined as any, "parameter")

        expect(fun).toThrow("Parameter 'parameter' is not defined")
    })

    it("Should not throw an error if the parameter is defined", () => {
        const fun = () => requireDefined(1, "parameter")

        expect(fun).not.toThrow()
    })

    it("Should throw an error if the parameter is not a number", () => {
        const fun = () => requireNumber("euo" as any, "parameter")

        expect(fun).toThrow("Parameter 'parameter' is not a number")
    })

    it("Should not throw an error if the parameter is a number", () => {
        const fun = () => requireNumber(1, "parameter")

        expect(fun).not.toThrow()
    })

    it("Should throw an error if the parameter is not a string", () => {
        const fun = () => requireString(1 as any, "parameter")

        expect(fun).toThrow("Parameter 'parameter' is not a string")
    })

    it("Should not throw an error if the parameter is a string", () => {
        const fun = () => requireString("string", "parameter")

        expect(fun).not.toThrow()
    })

    it("Should throw an error if the parameter is not an array", () => {
        const fun = () => requireArray(1 as any, "parameter")

        expect(fun).toThrow("Parameter 'parameter' is not an Array instance")
    })

    it("Should not throw an error if the parameter is an array", () => {
        const fun = () => requireArray([], "parameter")

        expect(fun).not.toThrow()
    })

    it("Should throw an error if the parameter is not a Uint8Array", () => {
        const fun = () => requireUint8Array([] as any, "parameter")

        expect(fun).toThrow("Parameter 'parameter' is not a Uint8Array instance")
    })

    it("Should not throw an error if the parameter is a Uint8Array", () => {
        const fun = () => requireUint8Array(new Uint8Array([]), "parameter")

        expect(fun).not.toThrow()
    })

    it("Should throw an error if the parameter is not a function", () => {
        const fun = () => requireFunction(1 as any, "parameter")

        expect(fun).toThrow("Parameter 'parameter' is not a function")
    })

    it("Should not throw an error if the parameter is a function", () => {
        const fun = () => requireFunction(() => true, "parameter")

        expect(fun).not.toThrow()
    })

    it("Should throw an error if the parameter is not an object", () => {
        const fun = () => requireObject(1 as any, "parameter")

        expect(fun).toThrow("Parameter 'parameter' is not an object")
    })

    it("Should not throw an error if the parameter is an object", () => {
        const fun = () => requireObject({}, "parameter")

        expect(fun).not.toThrow()
    })

    it("Should throw an error if the parameter is not a bigint", () => {
        const fun = () => requireBigInt(1 as any, "parameter")

        expect(fun).toThrow("Parameter 'parameter' is not a bigint")
    })

    it("Should not throw an error if the parameter is a bigint", () => {
        const fun = () => requireBigInt(BigInt(1), "parameter")

        expect(fun).not.toThrow()
    })

    it("Should throw an error if the parameter is not a stringified bigint", () => {
        const fun = () => requireStringifiedBigInt("string", "parameter")

        expect(fun).toThrow("Parameter 'parameter' is not a stringified bigint")
    })

    it("Should not throw an error if the parameter is a stringified bigint", () => {
        const fun = () => requireStringifiedBigInt("1", "parameter")

        expect(fun).not.toThrow()
    })

    it("Should throw an error if the parameter is not a hexadecimal", () => {
        const fun = () => requireHexadecimal("12", "parameter")

        expect(fun).toThrow("Parameter 'parameter' is not a hexadecimal")
    })

    it("Should not throw an error if the parameter is a hexadecimal", () => {
        const fun = () => requireStringifiedBigInt("0x12", "parameter")

        expect(fun).not.toThrow()
    })

    it("Should throw an error if the parameter is not a bignumber-ish", () => {
        const fun = () => requireBigNumberish("string", "parameter")

        expect(fun).toThrow("Parameter 'parameter' is not a bignumber-ish")
    })

    it("Should not throw an error if the parameter is a bignumber-ish", () => {
        const fun = () => requireBigNumberish("0x12", "parameter")

        expect(fun).not.toThrow()
    })

    it("Should throw an error if the parameter is neither a function nor a number", () => {
        const fun = () => requireTypes("string", "parameter", ["function", "number"])

        expect(fun).toThrow("Parameter 'parameter' is none of the following types: function, number")
    })

    it("Should not throw an error if the parameter is either a string or an array", () => {
        const fun = () => requireTypes("string", "parameter", ["string", "Array"])

        expect(fun).not.toThrow()
    })

    it("Should throw an error if the parameter types are not supported", () => {
        const fun = () => requireTypes("string", "parameter", ["string", "type" as any])

        expect(fun).toThrow("Type 'type' is not supported")
    })
})
