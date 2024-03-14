import { Buffer } from "buffer"
import {
    isArray,
    isBigInt,
    isBigNumber,
    isBigNumberish,
    isBuffer,
    isFunction,
    isHexadecimal,
    isNumber,
    isObject,
    isString,
    isStringifiedBigInt,
    isSupportedType,
    isType,
    isUint8Array
} from "../src"

describe("# type-checks", () => {
    it("Should return true if the value is a number", () => {
        expect(isNumber(1)).toBeTruthy()
    })

    it("Should return false if the value is not a number", () => {
        expect(isNumber("string")).toBeFalsy()
    })

    it("Should return true if the value is a string", () => {
        expect(isString("string")).toBeTruthy()
    })

    it("Should return false if the value is not a string", () => {
        expect(isString(1)).toBeFalsy()
    })

    it("Should return true if the value is a function", () => {
        expect(isFunction(() => true)).toBeTruthy()
    })

    it("Should return false if the value is not a function", () => {
        expect(isFunction(1)).toBeFalsy()
    })

    it("Should return true if the value is an Array instance", () => {
        expect(isArray([])).toBeTruthy()
    })

    it("Should return false if the value is not an Array instance", () => {
        expect(isArray(1)).toBeFalsy()
    })

    it("Should return true if the value is a Uint8Array", () => {
        expect(isUint8Array(new Uint8Array([]))).toBeTruthy()
    })

    it("Should return false if the value is not a Uint8Array", () => {
        expect(isUint8Array(1)).toBeFalsy()
    })

    it("Should return true if the value is a Buffer", () => {
        expect(isBuffer(Buffer.from("buffer"))).toBeTruthy()
    })

    it("Should return false if the value is not a Buffer", () => {
        expect(isBuffer(1)).toBeFalsy()
    })

    it("Should return true if the value is an object", () => {
        expect(isObject({})).toBeTruthy()
    })

    it("Should return false if the value is not an object", () => {
        expect(isObject(1)).toBeFalsy()
    })

    it("Should return true if the value is a bigint", () => {
        expect(isBigInt(BigInt(1))).toBeTruthy()
    })

    it("Should return false if the value is not a bigint", () => {
        expect(isBigInt(1)).toBeFalsy()
    })

    it("Should return true if the value is a stringified bigint", () => {
        expect(isStringifiedBigInt("1242342342342342")).toBeTruthy()
        expect(isStringifiedBigInt("0x12")).toBeTruthy()
    })

    it("Should return false if the value is not a stringified bigint", () => {
        expect(isStringifiedBigInt(1)).toBeFalsy()
    })

    it("Should return true if the value is a hexadecimal", () => {
        expect(isHexadecimal("0x12")).toBeTruthy()
    })

    it("Should return false if the value is not a hexadecimal", () => {
        expect(isHexadecimal("12")).toBeFalsy()
    })

    it("Should return true if the value is a bignumber", () => {
        expect(isBigNumber(1)).toBeFalsy()
        expect(isBigNumber("1")).toBeTruthy()
        expect(isBigNumber(BigInt("1"))).toBeTruthy()
        expect(isBigNumber("0x12")).toBeTruthy()
        expect(isBigNumber(Buffer.from("0x12"))).toBeFalsy()
    })

    it("Should return true if the value is a bignumber-ish", () => {
        expect(isBigNumberish(1)).toBeTruthy()
        expect(isBigNumberish("1")).toBeTruthy()
        expect(isBigNumberish(BigInt("1"))).toBeTruthy()
        expect(isBigNumberish("0x12")).toBeTruthy()
        expect(isBigNumberish(Buffer.from("0x12"))).toBeTruthy()
    })

    it("Should return false if the value is not a bignumber-ish", () => {
        expect(isHexadecimal("string")).toBeFalsy()
    })

    it("Should return true if the value type is the one expected", () => {
        expect(isType(1, "number")).toBeTruthy()
        expect(isType("string", "string")).toBeTruthy()
        expect(isType(() => true, "function")).toBeTruthy()
        expect(isType([], "Array")).toBeTruthy()
        expect(isType(new Uint8Array([]), "Uint8Array")).toBeTruthy()
        expect(isType(Buffer.from("buffer"), "Buffer")).toBeTruthy()
        expect(isType({}, "object")).toBeTruthy()
        expect(isType(BigInt(1), "bigint")).toBeTruthy()
        expect(isType("1242342342342342", "stringified-bigint")).toBeTruthy()
        expect(isType("0x12", "hexadecimal")).toBeTruthy()
        expect(isType(BigInt(1), "bignumber")).toBeTruthy()
        expect(isType("123", "bignumber")).toBeTruthy()
        expect(isType("0xa123", "bignumber")).toBeTruthy()
        expect(isType(1, "bignumberish")).toBeTruthy()
    })

    it("Should return false if the value type is not the one expected or is not supported", () => {
        expect(isType("string", "number")).toBeFalsy()
        expect(isType(1, "string")).toBeFalsy()
        expect(isType(1, "function")).toBeFalsy()
        expect(isType(1, "Array")).toBeFalsy()
        expect(isType(1, "Uint8Array")).toBeFalsy()
        expect(isType(1, "Buffer")).toBeFalsy()
        expect(isType(1, "object")).toBeFalsy()
        expect(isType(1, "bigint")).toBeFalsy()
        expect(isType(1, "stringified-bigint")).toBeFalsy()
        expect(isType(1, "hexadecimal")).toBeFalsy()
        expect(isType(1, "bignumber")).toBeFalsy()
        expect(isType("string", "bignumber")).toBeFalsy()
        expect(isType("string", "bignumberish")).toBeFalsy()
        expect(isType(1, "type" as any)).toBeFalsy()
    })

    it("Should return true if the type is supported", () => {
        expect(isSupportedType("number")).toBeTruthy()
    })

    it("Should return false if the type is not supported", () => {
        expect(isSupportedType("type")).toBeFalsy()
    })
})
