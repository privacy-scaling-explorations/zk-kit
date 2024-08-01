/**
 * Tokenization function to split the expression into meaningful tokens.
 * @param expression The expression to tokenize.
 * @returns A list with the tokens of the expression.
 *
 * @example
 * // Example usage:
 * import { tokenize } from "@zk-kit/logical-expressions"
 *
 * const expression = "true and false or ( true and true )"
 *
 * const tokens = tokenize(expression)
 *
 * console.log(tokens)
 * // Output: ["true", "and", "false", "or", "(", "true", "and", "true", ")"]
 */
export default function tokenize(expression: string): string[] {
    const tokenPattern = /\s*(\(|\)|and|or|not|xor|true|false)\s*/g
    // Split the expression based on the token pattern and filter out empty tokens
    return expression.split(tokenPattern).filter((token) => token.trim() !== "")
}
