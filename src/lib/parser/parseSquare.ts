import { ASTType, type AST } from "./AST";
import { TokenType, type Token } from "$lib/lexer";
import { parseNumberStart } from "./parseNumberStart";
import { createSyntaxTree } from "./parser";

export function parseSquare(tokens: Token[]): AST {
    let closeSquare = -1;
    let nesting = 0;
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type == TokenType.SquareOpen) nesting++;
        if (tokens[i].type == TokenType.SquareClose) {
            nesting--;
            if (nesting == 0) {
                closeSquare = i;
                break;
            }
        }
    }

    if (closeSquare != tokens.length - 1) return parseNumberStart(tokens);

    const separators: number[] = [];

    let paramNesting = 0;
    for (let i = 1; i < tokens.length - 1; i++) {
        if (
            tokens[i].type == TokenType.ParenOpen ||
            tokens[i].type == TokenType.SquareOpen ||
            tokens[i].type == TokenType.CurlyOpen
        ) paramNesting++;

        if (
            tokens[i].type == TokenType.ParenClose ||
            tokens[i].type == TokenType.SquareClose ||
            tokens[i].type == TokenType.CurlyClose
        ) paramNesting--;

        if (paramNesting == 0 && tokens[i].type == TokenType.Separator) separators.push(i);
    }

    const splits: Token[][] = [];

    let start = 1;
    for (const i of separators) {
        splits.push(tokens.slice(start, i));
        start = i + 1;
    }

    splits.push(tokens.slice(start, -1));
    
    return {
        type: ASTType.List,
        value: null,
        parts: splits.map(createSyntaxTree)
    };
}