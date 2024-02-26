import { type AST, ASTType } from "./AST";
import { type Token, TokenType } from "$lib/lexer";
import { createSyntaxTree } from "./parser";

export function parseIndexing(tokens: Token[]): AST {
    const openBracket: number = tokens.findIndex((v, i) => i != 0 && v.type == TokenType.SquareOpen);

    console.log(tokens);

    return {
        type: ASTType.Index,
        value: null,
        parts: [
            createSyntaxTree(tokens.slice(0, openBracket)),
            createSyntaxTree(tokens.slice(openBracket + 1, -1))
        ]
    };
}