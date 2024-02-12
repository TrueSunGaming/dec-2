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
    MutliplyAssign,
    DivideAssign,
    ExponentAssign,
    Equal,
    Greater,
    GreaterOrEqual,
    Less,
    LessOrEqual,
    NumberLiteral
}

export interface AST {
    type: ASTType;
    parts: AST[];
    value: string | null;
}