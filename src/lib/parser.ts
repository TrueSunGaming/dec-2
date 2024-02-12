import { ASTType, type AST } from "./AST";
import { orderOfOperations, type OperationType, operatorMap, operatorAST } from "./data";
import { TokenType, type Token } from "./lexer";

function splitTokens(tokens: Token[]): Token[][] {
    const split: Token[][] = [];

    let start = 0;
    let blockNesting = 0;
    let parenNesting = 0;
    let squareNesting = 0;

    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type == TokenType.ParenOpen) parenNesting++;
        if (tokens[i].type == TokenType.SquareOpen) {
            if (squareNesting > 0) throw new Error("Cannot store a list inside a list.");
            squareNesting++;
        }
        if (tokens[i].type == TokenType.CurlyOpen) blockNesting++;

        if (tokens[i].type == TokenType.ParenClose) parenNesting--;
        if (tokens[i].type == TokenType.SquareClose) squareNesting--;
        if (tokens[i].type == TokenType.CurlyClose) blockNesting--;

        if (tokens[i].type == TokenType.EOL && blockNesting + squareNesting + parenNesting == 0) {
            split.push(tokens.slice(start, i));
            start = i + 1;
        }
    }

    split.push(tokens.slice(start));

    return split.filter((v) => v.length > 0);
}

export function createSyntaxTree(tokens: Token[]): AST {
    const res: AST = {
        type: ASTType.Program,
        parts: [],
        value: null
    };

    const split: Token[][] = splitTokens(tokens);

    if (split.length == 0) return res;

    if (split.length > 1) {
        res.parts = split.map((v) => createSyntaxTree(v));
        return res;
    }

    return parseSplit(split[0]);
}

function parseSplit(tokens: Token[]): AST {
    const res: AST = {
        type: ASTType.Program,
        parts: [],
        value: null
    };
    
    switch(tokens[0].type) {
        case TokenType.Number:
            return parseNumberStart(tokens);
        default:
            return res;
    }
}

function parseNumberStart(tokens: Token[]): AST {
    const res: AST = {
        type: ASTType.Program,
        parts: [],
        value: null
    };

    if (tokens.length == 1) {
        res.type = ASTType.NumberLiteral;
        res.value = tokens[0].value;
        return res;
    }

    if (tokens.length >= 3) return parseNumberExpression(tokens);

    return res;
}

function parseNumberExpression(tokens: Token[]): AST {
    const res: AST = {
        type: ASTType.Program,
        parts: [],
        value: null
    };

    const operations: [string, number, number][] = [];

    let parenthesesLayer = 0;

    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type == TokenType.ParenOpen) parenthesesLayer++;
        if (tokens[i].type == TokenType.ParenClose) parenthesesLayer--;

        if (operatorMap.has(tokens[i].value)) operations.push([tokens[i].value, i, parenthesesLayer]);
    }

    if (operations.length < 1) throw new Error("No operation found in expression.");

    operations.sort((a, b) => {
        if (a[2] != b[2]) return b[2] - a[2];

        const typeA: OperationType = orderOfOperations.get(operatorMap.get(a[0])!)!;
        const typeB: OperationType = orderOfOperations.get(operatorMap.get(b[0])!)!;

        return typeA == typeB ? a[1] - b[1] : typeB - typeA;
    });

    console.log(operations);

    res.type = operatorAST.get(operations.at(-1)![0])!;

    return res;
}