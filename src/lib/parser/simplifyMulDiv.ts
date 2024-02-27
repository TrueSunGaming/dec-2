import { ASTType, type AST } from "./AST";
import { simplifyAST } from "./simplifyAST";
import { simplifyRecurse } from "./simplifyRecurse";

export function simplifyMulDiv(ast: AST): AST {
    if (ast.type == ASTType.Multiply && simplifyAST(ast.parts[0]).value == "1") return simplifyAST(ast.parts[1]);
    if (simplifyAST(ast.parts[1]).value == "1") return simplifyAST(ast.parts[0]);
    
    return simplifyRecurse(ast);
}