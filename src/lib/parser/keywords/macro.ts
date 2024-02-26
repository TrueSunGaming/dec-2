import { ASTType, type AST } from "../AST";
import { TokenType, type Token } from "$lib/lexer";
import { createSyntaxTree } from "../parser";

export function parseMacro(tokens: Token[]): AST {
    const res: AST = {
        type: ASTType.MacroDefine,
        value: tokens[1].value,
        parts: []
    };

    const openParen: number = tokens.findIndex((v) => v.type == TokenType.ParenOpen);
    const closeParen: number = tokens.findIndex((v) => v.type == TokenType.ParenClose);
    const openBlock: number = tokens.findIndex((v) => v.type == TokenType.CurlyOpen);

    if (openBlock != closeParen + 1) throw new Error("Expected opening curly brace after parameter closing parenthesis.");

    for (let i = openParen + 1; i < closeParen; i += 2) res.parts.push(createSyntaxTree([tokens[i]]));

    res.parts.push({
        type: ASTType.EndParameters,
        value: null,
        parts: []
    });

    const body: AST = createSyntaxTree(tokens.slice(openBlock + 1, -1));

    res.parts.push(body);

    return res;
}