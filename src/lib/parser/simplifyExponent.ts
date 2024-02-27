import type { AST } from "./AST";
import { simplifyAST } from "./simplifyAST";
import { simplifyRecurse } from "./simplifyRecurse";

export function simplifyExponent(ast: AST): AST {
    if (simplifyAST(ast.parts[1]).value == "1") return simplifyAST(ast.parts[0]);
    
    return simplifyRecurse(ast);
}