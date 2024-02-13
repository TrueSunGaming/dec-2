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
            return `${desmosFormat(ast.value ?? "")}(${ast.parts.slice(0, -1).map(compile).join(",")})=${compile(ast.parts.at(-1)!)}`;

        case ASTType.Declare:
            return `${desmosFormat(ast.value ?? "")}=${compile(ast.parts[0])}`;

        case ASTType.Add:
            return `(${compile(ast.parts[0])}+${compile(ast.parts[1])})`;

        case ASTType.Subtract:
            return `(${compile(ast.parts[0])}-${compile(ast.parts[1])})`;

        case ASTType.Multiply:
            return `(${compile(ast.parts[0])}\\cdot ${compile(ast.parts[1])})`;

        case ASTType.Divide:
            return `(\\frac{${compile(ast.parts[0])}}{${compile(ast.parts[1])}})`;

        case ASTType.Exponent:
            return `(${compile(ast.parts[0])}^{${compile(ast.parts[1])}})`;

        case ASTType.Assign:
            return `${compile(ast.parts[0])}\\to${compile(ast.parts[1])}`;

        case ASTType.AddAssign:
            return `${compile(ast.parts[0])}\\to(${compile(ast.parts[0])}+${compile(ast.parts[1])})`;            

        case ASTType.SubtractAssign:
            return `${compile(ast.parts[0])}\\to(${compile(ast.parts[0])}-${compile(ast.parts[1])})`;            

        case ASTType.MultiplyAssign:
            return `${compile(ast.parts[0])}\\to(${compile(ast.parts[0])}\\cdot ${compile(ast.parts[1])})`; 
        
        case ASTType.DivideAssign:
            return `${compile(ast.parts[0])}\\to(\\frac{${compile(ast.parts[0])}}{${compile(ast.parts[1])}})`;
        
        case ASTType.ExponentAssign:
            return `${compile(ast.parts[0])}\\to(${compile(ast.parts[0])}^{${compile(ast.parts[1])}})`;
        
        case ASTType.Equal:
            return `${compile(ast.parts[0])}=${compile(ast.parts[1])}`;
        
        case ASTType.Less:
            return `${compile(ast.parts[0])}<${compile(ast.parts[1])}`;
        
        case ASTType.LessOrEqual:
            return `${compile(ast.parts[0])}\\le${compile(ast.parts[1])}`;
        
        case ASTType.Greater:
            return `${compile(ast.parts[0])}>${compile(ast.parts[1])}`;
            
        case ASTType.GreaterOrEqual:
            return `${compile(ast.parts[0])}\\ge${compile(ast.parts[1])}`;
        
        case ASTType.NumberLiteral:
            return ast.value ?? "";
        
        case ASTType.ActionDeclare:
            return (() => {
                const paramLength: number = ast.parts.findIndex((v) => v.type == ASTType.EndParameters);
                return `${desmosFormat(ast.value ?? "")}(${ast.parts.slice(0, paramLength).map(compile).join(",")})=${ast.parts.slice(paramLength + 1).map(compile).join(",")}`;
            })();
        
        case ASTType.MacroDeclare:
            return ""; // TODO
        
        case ASTType.List:
            return `[${ast.parts.map(compile).join(",")}]`;
        
        case ASTType.Point:
            return `(${compile(ast.parts[0])},${compile(ast.parts[1])})`;

        default:
            return "";
    }
}

export function compileFormat(res: string): string {
    return res
        .replace(/\(/g, "\\left(")
        .replace(/\)/g, "\\right)")
        .replace(/\[/g, "\\left[")
        .replace(/\]/g, "\\right]")
        .replace(/\\\{/g, "\\left\\{")
        .replace(/\\\}/g, "\\right\\}");
}