import { ASTType, type AST } from "../AST";
import { TokenType, type Token } from "$lib/lexer";
import { createSyntaxTree } from "../parser";

export function parseIf(tokens: Token[]): AST {
    const res: AST = {
        type: ASTType.Conditional,
        value: null,
        parts: []
    };

    const openParen: number = tokens.findIndex((v) => v.type == TokenType.ParenOpen);
    const closeParen: number = tokens.findIndex((v) => v.type == TokenType.ParenClose);
    const openBlock: number = tokens.findIndex((v) => v.type == TokenType.CurlyOpen);
    const closeBlock: number = tokens.findIndex((v) => v.type == TokenType.CurlyClose);
    const elseStatements: number[] = tokens.flatMap((v, i) => v.type == TokenType.Keyword && (v.value == "else" || v.value == "elif") ? [i] : []);

    if (openBlock != closeParen + 1) throw new Error("Expected opening curly brace after parameter closing parenthesis.");

    res.parts.push(createSyntaxTree(tokens.slice(openParen + 1, closeParen)));
    res.parts.push(createSyntaxTree(tokens.slice(openBlock + 1, closeBlock)));
    if (elseStatements.length == 0) return res;
    if (elseStatements.length == 1) {
        if (tokens[elseStatements[0] + 1].type == TokenType.CurlyOpen) {
            res.parts.push(createSyntaxTree(tokens.slice(elseStatements[0] + 2, -1)));
            return res;
        }
    }

    if (tokens[elseStatements[0]].value != "elif") throw new Error("Expected elif preceding a conditional statement");

    res.parts.push(parseIf([
        { type: TokenType.Keyword, value: "if" },
        ...tokens.slice(elseStatements[0] + 1, -1)
    ]));

    return res;
}