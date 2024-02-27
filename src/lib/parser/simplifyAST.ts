import { ASTType, type AST } from "./AST";
import { simplifyAddSub } from "./simplifyAddSub";
import { simplifyExponent } from "./simplifyExponent";
import { simplifyMulDiv } from "./simplifyMulDiv";
import { simplifyRecurse } from "./simplifyRecurse";

export function simplifyAST(ast: AST): AST {
    if (ast.parts.length == 0) return ast;

    switch(ast.type) {
        case ASTType.Add:
            return simplifyAddSub(ast);

        case ASTType.Subtract:
            return simplifyAddSub(ast);

        case ASTType.Multiply:
            return simplifyMulDiv(ast);
        
        case ASTType.Divide:
            return simplifyMulDiv(ast);
        
        case ASTType.Exponent:
            return simplifyExponent(ast);
        
        default:
            return simplifyRecurse(ast);
    }
}