import { ASTType } from "../parser/AST";

export enum Operator {
    Add,
    Subtract,
    Multiply,
    Divide,
    Exponent,
    Assign,
    AddAssign,
    SubtractAssign,
    MultiplyAssign,
    DivideAssign,
    ExponentAssign,
    Equal,
    Greater,
    GreaterOrEqual,
    Less,
    LessOrEqual,
    Modulo,
    ModuloAssign,
    TernaryIf,
    TernaryElse
}

export const operatorMap: Map<string, Operator> = new Map([
    ["+=", Operator.AddAssign],
    ["-=", Operator.SubtractAssign],
    ["*=", Operator.MultiplyAssign],
    ["/=", Operator.DivideAssign],
    ["^=", Operator.ExponentAssign],
    ["%=", Operator.ModuloAssign],
    ["==", Operator.Equal],
    [">=", Operator.GreaterOrEqual],
    [">", Operator.Greater],
    ["<=", Operator.LessOrEqual],
    ["<", Operator.Less],
    ["+", Operator.Add],
    ["-", Operator.Subtract],
    ["*", Operator.Multiply],
    ["/", Operator.Divide],
    ["^", Operator.Exponent],
    ["%", Operator.Modulo],
    ["=", Operator.Assign],
    ["?", Operator.TernaryIf],
    [":", Operator.TernaryElse]
]);

export const operatorAST: Map<string, ASTType> = new Map([
    ["+=", ASTType.AddAssign],
    ["-=", ASTType.SubtractAssign],
    ["*=", ASTType.MultiplyAssign],
    ["/=", ASTType.DivideAssign],
    ["^=", ASTType.ExponentAssign],
    ["%=", ASTType.ModuloAssign],
    ["==", ASTType.Equal],
    [">=", ASTType.GreaterOrEqual],
    [">", ASTType.Greater],
    ["<=", ASTType.LessOrEqual],
    ["<", ASTType.Less],
    ["+", ASTType.Add],
    ["-", ASTType.Subtract],
    ["*", ASTType.Multiply],
    ["/", ASTType.Divide],
    ["^", ASTType.Exponent],
    ["%", ASTType.Modulo],
    ["=", ASTType.Assign]
]);

export enum OperationType {
    Assignment,
    Ternary,
    Comparison,
    AddSubtract,
    MultiplyDivide,
    Exponent,
    Modulo,
}

export const orderOfOperations: Map<Operator, OperationType> = new Map([
    [Operator.Assign,         OperationType.Assignment],
    [Operator.AddAssign,      OperationType.Assignment],
    [Operator.SubtractAssign, OperationType.Assignment],
    [Operator.MultiplyAssign, OperationType.Assignment],
    [Operator.DivideAssign,   OperationType.Assignment],
    [Operator.ExponentAssign, OperationType.Assignment],
    [Operator.ModuloAssign,   OperationType.Assignment],
    [Operator.Equal,          OperationType.Comparison],
    [Operator.GreaterOrEqual, OperationType.Comparison],
    [Operator.Greater,        OperationType.Comparison],
    [Operator.LessOrEqual,    OperationType.Comparison],
    [Operator.Less,           OperationType.Comparison],
    [Operator.Add,            OperationType.AddSubtract],
    [Operator.Subtract,       OperationType.AddSubtract],
    [Operator.Multiply,       OperationType.MultiplyDivide],
    [Operator.Divide,         OperationType.MultiplyDivide],
    [Operator.Exponent,       OperationType.Exponent],
    [Operator.Modulo,         OperationType.Modulo],
    [Operator.TernaryIf,      OperationType.Ternary],
    [Operator.TernaryElse,    OperationType.Ternary]
]);