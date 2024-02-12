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
        default:
            return "";
    }
}

export function compileFormat(res: string): string {
    return res.replace(/\(/g, "\\left(").replace(/\)/g, "\\right)");
}