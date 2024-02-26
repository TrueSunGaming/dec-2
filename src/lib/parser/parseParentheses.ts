import { ASTType, type AST } from "./AST";
import { TokenType, type Token } from "$lib/lexer";
import { parseNumberStart } from "./parseNumberStart";
import { createSyntaxTree } from "./parser";

export function parseParentheses(tokens: Token[]): AST {
    let closeParen = -1;
    let nesting = 0;
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type == TokenType.ParenOpen) nesting++;
        if (tokens[i].type == TokenType.ParenClose) {
            nesting--;
            if (nesting == 0) {
                closeParen = i;
                break;
            }
        }
    }

    if (closeParen != tokens.length - 1) return parseNumberStart(tokens);

    if (tokens.length >= 5 && tokens.some((v) => v.type == TokenType.Separator)) {
        const separatorPosition: number = tokens.findIndex((v) => v.type == TokenType.Separator);

        return {
            type: ASTType.Point,
            value: null,
            parts: [
                createSyntaxTree(tokens.slice(1, separatorPosition)),
                createSyntaxTree(tokens.slice(separatorPosition + 1, -1))
            ]
        }
    } 

    return createSyntaxTree(tokens.slice(1, -1));
}