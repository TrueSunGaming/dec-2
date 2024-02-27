import { ASTType, type AST } from "../AST";
import { TokenType, type Token } from "$lib/lexer";
import { createSyntaxTree } from "../parser";

export function parseAction(tokens: Token[]): AST {
    const res: AST = {
        type: ASTType.ActionDefine,
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

    console.log(tokens, openBlock);

    const body: AST = createSyntaxTree(tokens.slice(openBlock + 1, -1));

    console.log(tokens.slice(openBlock + 1, -1), body);

    res.parts.push(body);

    return res;
}