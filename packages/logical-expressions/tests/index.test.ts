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
        it("Should throw an error because there is an unknown token", () => {
            const expression = ["true", "op", "true"]
            const fun = () => evaluate(expression)
            expect(fun).toThrow("Unknown token: 'op'")
        })
        it("Should throw an error because there is an additional boolean value", () => {
            const expression = ["true", "true", "and", "false"]
            const fun = () => evaluate(expression)
            expect(fun).toThrow("Invalid logical expression")
        })
        it("Should throw an error because it is an invalid logical expression with a unary operator", () => {
            const expression = ["not"]
            const fun = () => evaluate(expression)
            expect(fun).toThrow("The operator 'not' requires one value")
        })
        it("Should throw an error because it is an invalid logical expression with a unary operator and parentheses", () => {
            const expression = ["(", "not", ")"]
            const fun = () => evaluate(expression)
            expect(fun).toThrow("The operator 'not' requires one value")
        })
        it("Should throw an error because it is an invalid logical expression with a binary operator", () => {
            const expression = ["true", "and"]
            const fun = () => evaluate(expression)
            expect(fun).toThrow("The operator 'and' requires two values")
        })
        it("Should throw an error because it is an invalid logical expression with a binary operator and parentheses", () => {
            const expression = ["(", "true", "and", ")"]
            const fun = () => evaluate(expression)
            expect(fun).toThrow("The operator 'and' requires two values")
        })
        it("Should throw an error because it is an invalid logical expression with two unary operators with the same precedence", () => {
            const expression = ["not", "not"]
            const fun = () => evaluate(expression)
            expect(fun).toThrow("The operator 'not' requires one value")
        })
        it("Should throw an error because it is an invalid logical expression with two binary operators with the same precedence", () => {
            const expression = ["and", "or"]
            const fun = () => evaluate(expression)
            expect(fun).toThrow("The operator 'and' requires two value")
        })
    })
})
