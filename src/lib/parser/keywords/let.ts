import { ASTType, type AST } from "../AST";
import type { Token } from "$lib/lexer";
import { createSyntaxTree } from "../parser";

export function parseLet(tokens: Token[]): AST {
    return {
        type: ASTType.Declare,
        value: createSyntaxTree([tokens[1]]).value,
        parts: [createSyntaxTree(tokens.slice(3))]
    }
}