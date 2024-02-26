import type { Token } from "$lib/lexer";
import { type AST, ASTType } from "./AST";
import { parseNumberExpression } from "./parseNumberExpression";

export function parseNumberStart(tokens: Token[]): AST {
    const res: AST = {
        type: ASTType.Program,
        parts: [],
        value: null
    };

    if (tokens.length == 1) {
        res.type = ASTType.NumberLiteral;
        res.value = tokens[0].value;
        return res;
    }

    if (tokens.length > 1) return parseNumberExpression(tokens);

    return res;
}