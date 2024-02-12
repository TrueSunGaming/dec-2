import { ASTType } from "./AST";

export enum Operator {
    Add,
    Subtract,
    Multiply,
    Divide,
    Exponent,
    Assign,
    AddAssign,
    SubtractAssign,
    MutliplyAssign,
    DivideAssign,
    ExponentAssign,
    Equal,
    Greater,
    GreaterOrEqual,
    Less,
    LessOrEqual
}

export const operatorMap: Map<string, Operator> = new Map([
    ["+=", Operator.AddAssign],
    ["-=", Operator.SubtractAssign],
    ["*=", Operator.MutliplyAssign],
    ["/=", Operator.DivideAssign],
    ["^=", Operator.ExponentAssign],
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
    ["=", Operator.Assign]
]);

export const operatorAST: Map<string, ASTType> = new Map([
    ["+=", ASTType.AddAssign],
    ["-=", ASTType.SubtractAssign],
    ["*=", ASTType.MutliplyAssign],
    ["/=", ASTType.DivideAssign],
    ["^=", ASTType.ExponentAssign],
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
    ["=", ASTType.Assign]
]);

export enum OperationType {
    Assignment = 0,
    Comparison = 1,
    AddSubtract = 2,
    MultiplyDivide = 3,
    Exponent = 4
}

export const orderOfOperations: Map<Operator, OperationType> = new Map([
    [Operator.Assign,         OperationType.Assignment],
    [Operator.AddAssign,      OperationType.Assignment],
    [Operator.SubtractAssign, OperationType.Assignment],
    [Operator.MutliplyAssign, OperationType.Assignment],
    [Operator.DivideAssign,   OperationType.Assignment],
    [Operator.ExponentAssign, OperationType.Assignment],
    [Operator.Equal,          OperationType.Comparison],
    [Operator.GreaterOrEqual, OperationType.Comparison],
    [Operator.Greater,        OperationType.Comparison],
    [Operator.LessOrEqual,    OperationType.Comparison],
    [Operator.Less,           OperationType.Comparison],
    [Operator.Add,            OperationType.AddSubtract],
    [Operator.Subtract,       OperationType.AddSubtract],
    [Operator.Multiply,       OperationType.MultiplyDivide],
    [Operator.Divide,         OperationType.MultiplyDivide],
    [Operator.Exponent,       OperationType.Exponent]
]);

export enum KeywordType {
    Normal,
    Block
}

export const keywordTypes: Map<string, KeywordType> = new Map([
    ["let", KeywordType.Normal],
    ["function", KeywordType.Block],
    ["macro", KeywordType.Block],
]);