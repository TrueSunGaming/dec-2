import type { AST } from "./AST";
import { simplifyAST } from "./simplifyAST";

export function simplifyRecurse(ast: AST): AST {
    const clone: AST = structuredClone(ast);
    clone.parts = clone.parts.map(simplifyAST);
    return clone;
}