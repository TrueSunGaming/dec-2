import { TokenType, type Token } from "$lib/lexer";

export function splitTokens(tokens: Token[]): Token[][] {
    const split: Token[][] = [];

    let start = 0;
    let blockNesting = 0;
    let parenNesting = 0;
    let squareNesting = 0;

    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type == TokenType.ParenOpen) parenNesting++;
        if (tokens[i].type == TokenType.SquareOpen) {
            if (squareNesting > 0) throw new Error("Cannot store a list inside a list.");
            squareNesting++;
        }
        if (tokens[i].type == TokenType.CurlyOpen) blockNesting++;

        if (tokens[i].type == TokenType.ParenClose) parenNesting--;
        if (tokens[i].type == TokenType.SquareClose) squareNesting--;
        if (tokens[i].type == TokenType.CurlyClose) blockNesting--;

        if (tokens[i].type == TokenType.EOL && blockNesting + squareNesting + parenNesting == 0) {
            split.push(tokens.slice(start, i));
            start = i + 1;
        }
    }

    split.push(tokens.slice(start));

    return split.filter((v) => v.length > 0);
}