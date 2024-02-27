import { type AST, ASTType } from "../AST";
import { type Token, TokenType } from "$lib/lexer";
import { createSyntaxTree } from "../parser";

export function parseFunction(tokens: Token[]): AST {
    const res: AST = {
        type: ASTType.Define,
        value: tokens[1].value,
        parts: []
    };

    const endParam: number = tokens.findIndex((v) => v.type == TokenType.ParenClose);

    for (let i = 3; i < endParam; i += 2) res.parts.push(createSyntaxTree([tokens[i]]));

    res.parts.push(createSyntaxTree(tokens.slice(endParam + 1)));

    return res;
}