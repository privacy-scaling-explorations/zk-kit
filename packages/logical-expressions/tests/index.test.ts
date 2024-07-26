import tokenize from "../src/tokenize"
import evaluate from "../src/evaluate"

describe("Logical Expressions", () => {
    describe("# tokenize", () => {
        it("Should sucessfully tokenize a logical expression", () => {
            const expression = "true and false or ( true and true )"

            const tokens = tokenize(expression)

            const result = ["true", "and", "false", "or", "(", "true", "and", "true", ")"]

            expect(tokens).toStrictEqual(result)
        })
    })
    describe("# evaluate", () => {
        it("Should sucessfully evaluate a logical expression with the and operator", () => {
            const expression = ["true", "and", "false"]
            const result = evaluate(expression)
            expect(result).toBeFalsy()
        })
        it("Should sucessfully evaluate a logical expression with the or operator", () => {
            const expression = ["true", "or", "false"]
            const result = evaluate(expression)
            expect(result).toBeTruthy()
        })
        it("Should sucessfully evaluate a logical expression with the not operator", () => {
            const expression = ["not", "false"]
            const result = evaluate(expression)
            expect(result).toBeTruthy()
        })
        it("Should sucessfully evaluate a logical expression with the xor operator", () => {
            const expression = ["false", "xor", "true"]
            const result = evaluate(expression)
            expect(result).toBeTruthy()
        })
        it("Should sucessfully evaluate a logical expression with the and or not and xor operators", () => {
            const expression = ["true", "and", "false", "or", "not", "false", "xor", "true"]
            const result = evaluate(expression)
            expect(result).toBeFalsy()
        })
        it("Should sucessfully evaluate a logical expression with parentheses", () => {
            const expression = [
                "true",
                "and",
                "false",
                "or",
                "(",
                "true",
                "and",
                "true",
                ")",
                "or",
                "(",
                "not",
                "false",
                ")"
            ]
            const result = evaluate(expression)
            expect(result).toBeTruthy()
        })
        it("Should throw an error because the operator is unknown", () => {
            const expression = ["true", "op", "true"]
            const fun = () => evaluate(expression)
            expect(fun).toThrow("Unknown token: op")
        })
    })
})
