import type { AST } from "../AST";
import { type Token, TokenType } from "$lib/lexer";
import { createSyntaxTree } from "../parser";

export function parseReplacement(tokens: Token[], replacement: string): AST {
    const newTokenList: Token[] = [...tokens];

    newTokenList[0] = {
        type: TokenType.LaTeX,
        value: replacement
    };

    return createSyntaxTree(newTokenList);
}