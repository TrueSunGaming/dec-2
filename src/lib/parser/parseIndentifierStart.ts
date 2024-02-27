import { ASTType, type AST } from "./AST";
import { TokenType, type Token } from "$lib/lexer";
import { parseNumberExpression } from "./parseNumberExpression";
import { createSyntaxTree } from "./parser";

export function parseIdentifierStart(tokens: Token[]): AST {
    const res: AST = {
        type: ASTType.Program,
        parts: [],
        value: null
    };

    if (tokens.length == 1) {
        res.type = ASTType.Access;
        res.value = tokens[0].value;
        return res;
    }

    if (tokens[1].type == TokenType.ParenOpen) {
        let nesting = 0;
        let close = -1;
        for (let i = 1; i < tokens.length; i++) {
            if (tokens[i].type == TokenType.ParenOpen) nesting++;
            if (tokens[i].type == TokenType.ParenClose) {
                nesting--;
                if (nesting == 0) {
                    close = i;
                    break;
                }
            }
        }

        const paramTokens: Token[] = tokens.slice(2, close);
        const params: Token[][] = [];
        let start = 0;
        let paramNesting = 0;
        for (let i = 0; i < paramTokens.length; i++) {
            if (
                paramTokens[i].type == TokenType.ParenOpen ||
                paramTokens[i].type == TokenType.SquareOpen ||
                paramTokens[i].type == TokenType.CurlyOpen
            ) paramNesting++;
    
            if (
                paramTokens[i].type == TokenType.ParenClose ||
                paramTokens[i].type == TokenType.SquareClose ||
                paramTokens[i].type == TokenType.CurlyClose
            ) paramNesting--;

            if (paramNesting != 0 || paramTokens[i].type != TokenType.Separator) continue;
            params.push(paramTokens.slice(start, i)); 
            start = i + 1;
        }

        params.push(paramTokens.slice(start));

        const filtered: Token[][] = params.filter((v) => v.length > 0);

        res.type = ASTType.Call;
        res.value = tokens[0].value;
        res.parts = filtered.map(createSyntaxTree);

        return {
            type: ASTType.Call,
            value: tokens[0].value,
            parts: filtered.map(createSyntaxTree)
        };
    }

    if (tokens.length > 1) return parseNumberExpression(tokens);

    return res;
}