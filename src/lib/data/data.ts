import { ASTType } from "../parser/AST";

export const keywords: string[] = [
    "let",
    "function",
    "action",
    "macro",
    "alpha",
    "beta",
    "theta",
    "phi",
    "pi",
    "tau",
    "infinity",
    "if",
    "else",
    "elif"
];

export const macroReplaceable: ASTType[] = [
    ASTType.Access,
    ASTType.Call,
    ASTType.Define,
    ASTType.Declare,
    ASTType.ActionDefine
];