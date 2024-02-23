import { ASTType, type AST } from "./AST";
import { stdlib } from "./data";
import { desmosFormat } from "./desmosFormat";
import { generateTokens, type PositionedToken } from "./lexer";
import { createSyntaxTree } from "./parser";

const macros: Map<string, [string[], AST]> = new Map();

function buildMacro(name: string, params: AST[]): AST {
    console.log(name);

    const res: AST = structuredClone(macros.get(name)![1]);
    const paramMap: Map<string, AST> = new Map(params.map((v, i) => [
        macros.get(name)![0][i],
        v
    ]));

    console.log(res);

    for (let i = 0; i < res.parts.length; i++) {
        if (res.parts[i].type != ASTType.Access || !paramMap.has(res.parts[i].value ?? "")) continue;

        res.parts[i] = paramMap.get(res.parts[i].value!)!;
    }

    console.log("resulting macro", res);

    return res;
}

export function compile(ast: AST, first = false): string {
    if (first) macros.clear();

    switch(ast.type) {
        case ASTType.Program:
            return ast.parts.map((v) => compile(v)).join("\n");

        case ASTType.Access:
            return desmosFormat(ast.value ?? "");

        case ASTType.Call:
            if (!stdlib.has(ast.value ?? "") && !macros.has(ast.value ?? "")) return `${desmosFormat(ast.value ?? "")}(${ast.parts.map((v) => compile(v)).join(",")})`;

            console.log(stdlib.has(ast.value ?? ""), macros.has(ast.value ?? ""));

            if (stdlib.has(ast.value ?? "")) return (() => {
                let res: string = stdlib.get(ast.value!)!;
                for (let i = 0; i < ast.parts.length; i++) res = res.replaceAll(`%%${i}%%`, compile(ast.parts[i]));
                return res;
            })();

            return compile(buildMacro(ast.value ?? "", ast.parts));
        
        case ASTType.Define:
            return `${desmosFormat(ast.value ?? "")}(${ast.parts.slice(0, -1).map((v) => compile(v)).join(",")})=${compile(ast.parts.at(-1)!)}`;

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
        
        case ASTType.Modulo:
            return `\\operatorname{mod}(${compile(ast.parts[0])},${compile(ast.parts[1])})`;

        case ASTType.Assign:
            return `${compile(ast.parts[0])}\\to(${compile(ast.parts[1])})`;

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
        
        case ASTType.ModuloAssign:
            return `${compile(ast.parts[0])}\\to\\operatorname{mod}(${compile(ast.parts[0])},${compile(ast.parts[1])})`;
        
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
        
        case ASTType.ActionDefine:
            return (() => {
                const paramLength: number = ast.parts.findIndex((v) => v.type == ASTType.EndParameters);
                return `${desmosFormat(ast.value ?? "")}(${ast.parts.slice(0, paramLength).map((v) => compile(v)).join(",")})=${ast.parts.slice(paramLength + 1).map((v) => compile(v)).join(",")}`;
            })();
        
        case ASTType.MacroDefine:
            if (!ast.value) return "";
            
            return (() => {
                const paramLength: number = ast.parts.findIndex((v) => v.type == ASTType.EndParameters);

                macros.set(ast.value, [
                    ast.parts.slice(0, paramLength).map((v) => v.value!),
                    {
                        type: ASTType.Program,
                        value: null,
                        parts: ast.parts.slice(paramLength + 1)
                    }
                ]);

                console.log(macros.get(ast.value));

                return "";
            })();
        
        case ASTType.List:
            return `[${ast.parts.map((v) => compile(v)).join(",")}]`;
        
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

export function fullCompile(code: string): string {
    const tokens: PositionedToken[] = generateTokens(code);
    console.log("tokens", tokens);
    const ast: AST = createSyntaxTree(tokens);
    console.log("ast", ast);
    return compileFormat(compile(ast, true));
}