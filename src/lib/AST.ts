export enum ASTType {
    Program,
    Access,
    Call,
    Define,
    Declare,
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
    NumberLiteral,
    ActionDeclare
}

export interface AST {
    type: ASTType;
    parts: AST[];
    value: string | null;
}