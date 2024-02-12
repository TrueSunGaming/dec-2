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
        case TokenType.ParenOpen:
            return parseParentheses(tokens);
        case TokenType.Identifier:
            return parseIndentifierStart(tokens);
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

function parseIndentifierStart(tokens: Token[]): AST {
    const res: AST = {
        type: ASTType.Program,
        parts: [],
        value: null
    };

    if (tokens.length == 1) {
        res.type = ASTType.Access;
        res.value = tokens[0].value;
        return res;
    }

    let extraTokens = 0;

    if (tokens[1].type == TokenType.ParenOpen) {
        let nesting = 0;
        let close = -1;
        for (let i = 1; i < tokens.length; i++) {
            if (tokens[i].type == TokenType.ParenOpen) nesting++;
            if (tokens[i].type == TokenType.ParenClose) {
                nesting--;
                if (nesting == 0) close = i;
                extraTokens = i;
                break;
            }
        }

        const paramTokens: Token[] = tokens.slice(2, close);
        const params: Token[][] = [];
        let start = 0;
        for (let i = 0; i < paramTokens.length; i++) {
            if (paramTokens[i].type != TokenType.Separator) continue;
            start = i + 1;
            params.push(paramTokens.slice(start, i)); 
        }

        params.push(paramTokens.slice(start));

        const filtered: Token[][] = params.filter((v) => v.length > 0);

        console.log(filtered);

        res.type = ASTType.Call;
        res.value = tokens[0].value;
        res.parts = filtered.map(createSyntaxTree);
    }

    if (tokens.length >= 3 + extraTokens) return parseNumberExpression(tokens);

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

    const lastOperation: [string, number, number] = operations.at(-1)!;

    res.type = operatorAST.get(lastOperation[0])!;
    res.parts = [
        createSyntaxTree(tokens.slice(0, lastOperation[1])),
        createSyntaxTree(tokens.slice(lastOperation[1] + 1))
    ];

    return res;
}

function parseParentheses(tokens: Token[]): AST {
    if (tokens.at(-1)?.type == TokenType.ParenClose) return createSyntaxTree(tokens.slice(1, -1));

    return parseNumberStart(tokens);
}