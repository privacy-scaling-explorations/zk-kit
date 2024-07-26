/**
 * Tokenization function to split the expression into meaningful tokens.
 * @param expression The expression to tokenize.
 * @returns A list with the tokens of the expression.
 */
export default function tokenize(expression: string): string[] {
    const tokenPattern = /\s*(\(|\)|and|or|not|xor|true|false)\s*/g
    // Split the expression based on the token pattern and filter out empty tokens
    return expression.split(tokenPattern).filter((token) => token.trim() !== "")
}
