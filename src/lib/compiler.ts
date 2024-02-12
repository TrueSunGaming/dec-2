import { ASTType, type AST } from "./AST";
import { desmosFormat } from "./desmosFormat";

export function compile(ast: AST): string {
    switch(ast.type) {
        case ASTType.Program:
            return ast.parts.map(compile).join("\n");

        case ASTType.Access:
            return desmosFormat(ast.value ?? "");

        case ASTType.Call:
            return `${desmosFormat(ast.value ?? "")}(${ast.parts.map(compile).join(",")})`;

        case ASTType.Define:
            return `${desmosFormat(ast.value ?? "")}=${compile(ast.parts[0])}`;

        case ASTType.Declare:
            return `${desmosFormat(ast.value ?? "")}(${ast.parts.slice(0, -1).map(compile).join(",")})=${compile(ast.parts.at(-1)!)}`;

        case ASTType.Add:
            return `(${compile(ast.parts[0])}+${compile(ast.parts[1])})`;

        case ASTType.Subtract:
            return `(${compile(ast.parts[0])}-${compile(ast.parts[1])})`;

        case ASTType.Multiply:
            return `(${compile(ast.parts[0])}\\cdot${compile(ast.parts[1])})`;

        case ASTType.Divide:
            return `(\\frac{${compile(ast.parts[0])}}{${compile(ast.parts[1])}})`;

        case ASTType.Exponent:
            return `(${compile(ast.parts[0])}^{${compile(ast.parts[1])}})`;

        case ASTType.Assign:
            return `${desmosFormat(ast.value ?? "")}\\to${compile(ast.parts[0])}`;

        case ASTType.AddAssign:
            return `${desmosFormat(ast.value ?? "")}\\to(${desmosFormat(ast.value ?? "")}+${compile(ast.parts[0])})`;            

        case ASTType.SubtractAssign:
            return `${desmosFormat(ast.value ?? "")}\\to(${desmosFormat(ast.value ?? "")}-${compile(ast.parts[0])})`;            

        case ASTType.MultiplyAssign:
            return `${desmosFormat(ast.value ?? "")}\\to(${desmosFormat(ast.value ?? "")}\\cdot${compile(ast.parts[0])})`; 
        
        case ASTType.DivideAssign:
            return `${desmosFormat(ast.value ?? "")}\\to(\\frac{${desmosFormat(ast.value ?? "")}}{${compile(ast.parts[0])}})`;
        
        case ASTType.ExponentAssign:
            return `${desmosFormat(ast.value ?? "")}\\to(${desmosFormat(ast.value ?? "")}^{${compile(ast.parts[0])}})`;
        
        case ASTType.Equal:
            return `(${desmosFormat(ast.value ?? "")}=${compile(ast.parts[0])})`;
        
        case ASTType.Less:
            return `(${desmosFormat(ast.value ?? "")}<${compile(ast.parts[0])})`;
        
        case ASTType.LessOrEqual:
            return `(${desmosFormat(ast.value ?? "")}\\le${compile(ast.parts[0])})`;
        
        case ASTType.Greater:
            return `(${desmosFormat(ast.value ?? "")}>${compile(ast.parts[0])})`;
            
        case ASTType.GreaterOrEqual:
            return `(${desmosFormat(ast.value ?? "")}\\ge${compile(ast.parts[0])})`;
        
        case ASTType.NumberLiteral:
            return ast.value ?? "";
        
        case ASTType.ActionDeclare:
            return (() => {
                const paramLength: number = ast.parts.findIndex((v) => v.type == ASTType.EndParameters);
                return `${desmosFormat(ast.value ?? "")}(${ast.parts.slice(0, paramLength).map(compile).join(",")})=${ast.parts.slice(paramLength + 1).map(compile).join(",")}`;
            })();
        
        case ASTType.MacroDeclare:
            return ""; // TODO

        default:
            return "";
    }
}

export function compileFormat(res: string): string {
    return res.replace(/\(/g, "\\left(").replace(/\)/g, "\\right)");
}