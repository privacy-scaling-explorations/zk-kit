/**
 * Function to determine the precedence of operators.
 * Unary operators have higher precedence.
 * Binary operators have the same precedence.
 * @param operator Operator to check the precedence.
 * @returns The precedence of the operator or 0 if
 * the operator is not supported
 *
 * @example
 * import { precedence } from "@zk-kit/logical-expressions"
 *
 * const result = precedence("and");
 * console.log(result); // Output: 1
 */
export function precedence(operator: string): number {
    if (operator === "not") return 2 // Highest precedence
    if (operator === "and") return 1
    if (operator === "xor") return 1
    if (operator === "or") return 1 // Lowest precedence
    return 0
}

/**
 * Function to apply unary or binary operators to boolean values.
 * Logical operators supported: `and`, `or`, `not`, `xor`.
 * @param operator Operator to apply.
 * @param a First boolean value.
 * @param b Second boolean value (optional, only used for binary operators).
 * @returns The boolean value after applying the operator.
 *
 * @example
 * import { applyOperator } from "@zk-kit/logical-expressions"
 *
 * // Unary operator
 * const result1 = applyOperator("not", true);
 * console.log(result1); // Output: false
 *
 * // Binary operator
 * const result2 = applyOperator("and", true, false);
 * console.log(result2); // Output: false
 */
export function applyOperator(operator: string, a: boolean, b?: boolean): boolean {
    switch (operator) {
        case "and":
            if (b === undefined) {
                throw new Error(`The operator '${operator}' requires two values`)
            }
            return a && b
        case "or":
            if (b === undefined) {
                throw new Error(`The operator '${operator}' requires two values`)
            }
            return a || b
        case "not":
            if (b !== undefined) {
                throw new Error(`The operator '${operator}' requires only one value`)
            }
            return !a
        case "xor":
            if (b === undefined) {
                throw new Error(`The operator '${operator}' requires two values`)
            }
            return a !== b // XOR returns true if only one of the operands is true
        default:
            throw new Error(`Unknown operator: '${operator}'`)
    }
}

/**
 * Function to evaluate a tokenized expression.
 * This algorithm is an adaptation of the
 * {@link https://en.wikipedia.org/wiki/Shunting_yard_algorithm | Shunting Yard}
 * algorithm to evaluate expressions with logical operators.
 * If the logical expression is incorrect, an error will be thrown automatically,
 * eliminating the need for previous validation.
 *
 * Logical operators supported: `and`, `or`, `not`, `xor`.
 * All other existing logical operators (`nand`, `nor`, `xnor`)
 * can be generated using the supported logical operators.
 * @param tokens Tokens of the expression.
 * The tokens can be boolean values, logical operators or parentheses.
 * @returns The boolean value after evaluating the expression.
 *
 * @example
 * // Example usage:
 * import { evaluate } from "@zk-kit/logical-expressions"
 *
 * const expression = ["true", "and", "false"]
 * const result = evaluate(expression)
 *
 * console.log(result)
 * // Output: false
 */
export function evaluate(tokens: string[]): boolean {
    const values: boolean[] = [] // Stack to store boolean values
    const ops: string[] = [] // Stack to store operators

    for (let i = 0; i < tokens.length; i += 1) {
        const token = tokens[i]

        if (token === "true") {
            values.push(true)
        } else if (token === "false") {
            values.push(false)
        } else if (token === "(") {
            ops.push(token)
        } else if (token === ")") {
            // Evaluate the expression inside the parentheses
            while (ops.length > 0 && ops[ops.length - 1] !== "(") {
                const op = ops.pop()!
                if (op === "not") {
                    const val = values.pop()
                    if (val === undefined) {
                        throw new Error(`The operator '${op}' requires one value`)
                    }
                    values.push(applyOperator(op, val))
                } else {
                    const b = values.pop()
                    const a = values.pop()
                    if (b === undefined || a === undefined) {
                        throw new Error(`The operator '${op}' requires two values`)
                    }
                    values.push(applyOperator(op, a, b))
                }
            }
            ops.pop() // Remove '(' from stack
        } else if (["and", "or", "not", "xor"].includes(token)) {
            // Handle operators and ensure the correct precedence
            while (ops.length > 0 && precedence(ops[ops.length - 1]) >= precedence(token)) {
                const op = ops.pop()!
                if (op === "not") {
                    const val = values.pop()
                    if (val === undefined) {
                        throw new Error(`The operator '${op}' requires one value`)
                    }
                    values.push(applyOperator(op, val))
                } else {
                    const b = values.pop()
                    const a = values.pop()
                    if (b === undefined || a === undefined) {
                        throw new Error(`The operator '${op}' requires two values`)
                    }
                    values.push(applyOperator(op, a, b))
                }
            }
            ops.push(token)
        } else {
            // Will throw and error if there is an unknown token in the expression
            throw new Error(`Unknown token: '${token}'`)
        }
    }

    // Apply remaining operators to remaining values
    while (ops.length > 0) {
        const op = ops.pop()!
        if (op === "not") {
            const val = values.pop()
            if (val === undefined) {
                throw new Error(`The operator '${op}' requires one value`)
            }
            values.push(applyOperator(op, val))
        } else {
            const b = values.pop()
            const a = values.pop()
            if (b === undefined || a === undefined) {
                throw new Error(`The operator '${op}' requires two values`)
            }
            values.push(applyOperator(op, a, b))
        }
    }

    if (values.length !== 1) {
        throw new Error("Invalid logical expression")
    }

    return values.pop()!
}
