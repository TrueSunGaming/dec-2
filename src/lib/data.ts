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
    MultiplyAssign,
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
    ["*=", Operator.MultiplyAssign],
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
    ["*=", ASTType.MultiplyAssign],
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
    [Operator.MultiplyAssign, OperationType.Assignment],
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
    ["action", KeywordType.Block],
    ["macro", KeywordType.Block],
]);

// %%n%% -> replaced by nth argument
export const stdlib: Map<string, string> = new Map([
    ["getx", "(%%0%%).x"],
    ["gety", "(%%0%%).y"],
    ["index", "(%%0%%)[(%%1%%)+1]"],
    ["index1", "(%%0%%)[%%1%%]"],

    ["if", "\\{%%0%%:%%1%%,%%2%%\\}"],

    ["pi", "\\pi"],
    ["tau", "\\tau"],
    ["infinity", "\\infty"],

    ["sqrt", "\\sqrt{%%0%%}"],
    ["cbrt", "\\sqrt[3]{%%0%%}"],
    ["root", "\\sqrt[%%1%%]{%%0%%}"],

    ["sin", "\\sin(%%0%%)"],
    ["cos", "\\cos(%%0%%)"],
    ["tan", "\\tan(%%0%%)"],
    ["csc", "\\csc(%%0%%)"],
    ["sec", "\\sec(%%0%%)"],
    ["cot", "\\cot(%%0%%)"],
    ["sin2", "\\sin^{2}(%%0%%)"],
    ["cos2", "\\cos^{2}(%%0%%)"],
    ["tan2", "\\tan^{2}(%%0%%)"],
    ["csc2", "\\csc^{2}(%%0%%)"],
    ["sec2", "\\sec^{2}(%%0%%)"],
    ["cot2", "\\cot^{2}(%%0%%)"],
    ["arcsin", "\\arcsin(%%0%%)"],
    ["arccos", "\\arccos(%%0%%)"],
    ["arctan", "\\arctan(%%0%%)"],
    ["arccsc", "\\operatorname{arccsc}(%%0%%)"],
    ["arcsec", "\\operatorname{arcsec}(%%0%%)"],
    ["arccot", "\\operatorname{arccot}(%%0%%)"],
    ["atan2", "\\arctan(%%0%%,%%1%%)"],

    ["mean", "\\operatorname{mean}(%%0%%)"],
    ["median", "\\operatorname{median}(%%0%%)"],
    ["min", "\\operatorname{min}(%%0%%)"],
    ["max", "\\operatorname{max}(%%0%%)"],
    ["quartile", "\\operatorname{quartile}(%%0%%,%%1%%)"],
    ["quantile", "\\operatorname{quantile}(%%0%%,%%1%%)"],
    ["stdev", "\\operatorname{stdev}(%%0%%)"],
    ["stdevp", "\\operatorname{stdevp}(%%0%%)"],
    ["var", "\\operatorname{var}(%%0%%)"],
    ["mad", "\\operatorname{mad}(%%0%%)"],
    ["cov", "\\operatorname{cov}(%%0%%,%%1%%)"],
    ["covp", "\\operatorname{covp}(%%0%%,%%1%%)"],
    ["corr", "\\operatorname{corr}(%%0%%,%%1%%)"],
    ["spearman", "\\operatorname{spearman}(%%0%%,%%1%%)"],
    ["count", "\\operatorname{count}(%%0%%)"],
    ["total", "\\operatorname{total}(%%0%%)"],

    ["join", "\\operatorname{join}(%%0%%,%%1%%)"],
    ["sort", "\\operatorname{sort}(%%0%%)"],
    ["shuffle", "\\operatorname{shuffle}(%%0%%)"],
    ["unique", "\\operatorname{unique}(%%0%%)"],
    ["map", "[(%%2%%)\\operatorname{for}%%1%%=%%0%%]"],
    ["unique", "\\operatorname{tdist}(%%0%%)"],

    ["normalDist", "\\operatorname{normaldist}(%%0%%,%%1%%)"],
    ["poissonDist", "\\operatorname{poissondist}(%%0%%)"],
    ["binomialDist", "\\operatorname{binomialdist}(%%0%%,%%1%%)"],
    ["uniformDist", "\\operatorname{uniformdist}(%%0%%,%%1%%)"],
    ["random", "\\operatorname{random}()"],
    ["pdf", "(%%0%%).\\operatorname{pdf}(%%1%%)"],
    ["cdf", "(%%0%%).\\operatorname{cdf}(%%1%%)"],
    ["inverseCDF", "(%%0%%).\\operatorname{inversecdf}(%%1%%)"],

    ["exp", "\\exp(%%0%%)"],
    ["ln", "\\ln(%%0%%)"],
    ["log10", "\\log(%%0%%)"],
    ["log", "\\log_{%%1%%}(%%0%%)"],
    ["derivative", "\\frac{d}{d%%1%%}(%%0%%)"],
    ["integral", "\\int_{%%1%%}^{%%2%%}(%%0%%)d%%3%%"]
]);