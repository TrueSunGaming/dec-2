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
    ActionDefine,
    EndParameters,
    MacroDefine,
    List,
    Point,
    Modulo,
    ModuloAssign,
    LaTeX,
    LaTeXConcat,
    Index,
    Conditional
}

export interface AST {
    type: ASTType;
    parts: AST[];
    value: string | null;
}