import { ASTType, type AST } from "./AST";
import type { Token } from "$lib/lexer";
import { parseNumberExpression } from "./parseNumberExpression";

export function parseLaTeX(tokens: Token[]): AST {
    if (tokens.length > 1) return parseNumberExpression(tokens);

    return {
        type: ASTType.LaTeX,
        value: tokens[0].value,
        parts: []
    };
}