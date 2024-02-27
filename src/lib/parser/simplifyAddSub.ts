import { ASTType, type AST } from "./AST";
import { simplifyAST } from "./simplifyAST";
import { simplifyRecurse } from "./simplifyRecurse";

export function simplifyAddSub(ast: AST): AST {
    if (simplifyAST(ast.parts[0]).value == "0") {
        if (ast.type == ASTType.Add) return simplifyAST(ast.parts[1]);

        return {
            type: ASTType.Call,
            value: "neg",
            parts: [simplifyAST(ast.parts[1])],
        };
    }

    if (simplifyAST(ast.parts[1]).value == "0") return simplifyAST(ast.parts[0]);
    
    return simplifyRecurse(ast);
}