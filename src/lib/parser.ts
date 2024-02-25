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
            return parseIdentifierStart(tokens);
        case TokenType.SquareOpen:
            return parseSquare(tokens);
        case TokenType.Keyword:
            return parseKeyword(tokens);
        case TokenType.LaTeX:
            return parseLaTeX(tokens);
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

    if (tokens.length > 1) return parseNumberExpression(tokens);

    return res;
}

function parseIdentifierStart(tokens: Token[]): AST {
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

    if (tokens[1].type == TokenType.ParenOpen) {
        let nesting = 0;
        let close = -1;
        for (let i = 1; i < tokens.length; i++) {
            if (tokens[i].type == TokenType.ParenOpen) nesting++;
            if (tokens[i].type == TokenType.ParenClose) {
                nesting--;
                if (nesting == 0) {
                    close = i;
                    break;
                }
            }
        }

        const paramTokens: Token[] = tokens.slice(2, close);
        const params: Token[][] = [];
        let start = 0;
        let paramNesting = 0;
        for (let i = 0; i < paramTokens.length; i++) {
            if (
                paramTokens[i].type == TokenType.ParenOpen ||
                paramTokens[i].type == TokenType.SquareOpen ||
                paramTokens[i].type == TokenType.CurlyOpen
            ) paramNesting++;
    
            if (
                paramTokens[i].type == TokenType.ParenClose ||
                paramTokens[i].type == TokenType.SquareClose ||
                paramTokens[i].type == TokenType.CurlyClose
            ) paramNesting--;

            if (paramNesting != 0 || paramTokens[i].type != TokenType.Separator) continue;
            params.push(paramTokens.slice(start, i)); 
            start = i + 1;
        }

        params.push(paramTokens.slice(start));

        const filtered: Token[][] = params.filter((v) => v.length > 0);

        res.type = ASTType.Call;
        res.value = tokens[0].value;
        res.parts = filtered.map(createSyntaxTree);

        return {
            type: ASTType.Call,
            value: tokens[0].value,
            parts: filtered.map(createSyntaxTree)
        };
    }

    if (tokens.length > 1) return parseNumberExpression(tokens);

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
    let bracketLayer = 0;

    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type == TokenType.ParenOpen) parenthesesLayer++;
        if (tokens[i].type == TokenType.ParenClose) parenthesesLayer--;
        
        if (tokens[i].type == TokenType.SquareOpen) bracketLayer++;
        if (tokens[i].type == TokenType.SquareClose) bracketLayer--;

        if (bracketLayer == 0 && operatorMap.has(tokens[i].value)) operations.push([tokens[i].value, i, parenthesesLayer]);
    }

    if (operations.length < 1) {
        const latex: number[] = tokens.flatMap((v, i) => v.type == TokenType.LaTeX ? [i] : []);

        if (latex.length < 1) {
            const square: number = tokens.findIndex((v) => v.type == TokenType.SquareOpen);

            if (square == -1) throw new Error(`No index, operation, or LaTeX string found in expression.`);

            return parseIndexing(tokens);
        }

        const res: AST = {
            type: ASTType.LaTeXConcat,
            value: null,
            parts: []
        };

        for (let i = 0; i < latex.length; i++) {
            res.parts.push(
                createSyntaxTree(tokens.slice(i == 0 ? 0 : latex[i - 1] + 1, latex[i])),
                parseLaTeX([tokens[latex[i]]])
            );
        }

        return res;
    }

    operations.sort((a, b) => {
        if (a[2] != b[2]) return b[2] - a[2];

        const typeA: OperationType = orderOfOperations.get(operatorMap.get(a[0])!)!;
        const typeB: OperationType = orderOfOperations.get(operatorMap.get(b[0])!)!;

        return typeA == typeB ? a[1] - b[1] : typeB - typeA;
    });

    const lastOperation: [string, number, number] = operations.at(-1)!;

    res.type = operatorAST.get(lastOperation[0])!;
    res.parts = [
        createSyntaxTree(tokens.slice(0, lastOperation[1])),
        createSyntaxTree(tokens.slice(lastOperation[1] + 1))
    ];

    return res;
}

function parseParentheses(tokens: Token[]): AST {
    let closeParen = -1;
    let nesting = 0;
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type == TokenType.ParenOpen) nesting++;
        if (tokens[i].type == TokenType.ParenClose) {
            nesting--;
            if (nesting == 0) {
                closeParen = i;
                break;
            }
        }
    }

    if (closeParen != tokens.length - 1) return parseNumberStart(tokens);

    if (tokens.length >= 5 && tokens.some((v) => v.type == TokenType.Separator)) {
        const separatorPosition: number = tokens.findIndex((v) => v.type == TokenType.Separator);

        return {
            type: ASTType.Point,
            value: null,
            parts: [
                createSyntaxTree(tokens.slice(1, separatorPosition)),
                createSyntaxTree(tokens.slice(separatorPosition + 1, -1))
            ]
        }
    } 

    return createSyntaxTree(tokens.slice(1, -1));
}

function parseSquare(tokens: Token[]): AST {
    let closeSquare = -1;
    let nesting = 0;
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type == TokenType.SquareOpen) nesting++;
        if (tokens[i].type == TokenType.SquareClose) {
            nesting--;
            if (nesting == 0) {
                closeSquare = i;
                break;
            }
        }
    }

    if (closeSquare != tokens.length - 1) return parseNumberStart(tokens);

    const separators: number[] = [];

    let paramNesting = 0;
    for (let i = 1; i < tokens.length - 1; i++) {
        if (
            tokens[i].type == TokenType.ParenOpen ||
            tokens[i].type == TokenType.SquareOpen ||
            tokens[i].type == TokenType.CurlyOpen
        ) paramNesting++;

        if (
            tokens[i].type == TokenType.ParenClose ||
            tokens[i].type == TokenType.SquareClose ||
            tokens[i].type == TokenType.CurlyClose
        ) paramNesting--;

        if (paramNesting == 0 && tokens[i].type == TokenType.Separator) separators.push(i);
    }

    const splits: Token[][] = [];

    let start = 1;
    for (const i of separators) {
        splits.push(tokens.slice(start, i));
        start = i + 1;
    }

    splits.push(tokens.slice(start, -1));
    
    return {
        type: ASTType.List,
        value: null,
        parts: splits.map(createSyntaxTree)
    };
}

function parseKeyword(tokens: Token[]): AST {
    switch(tokens[0].value) {
        case "let":
            return parseLet(tokens);
        case "function":
            return parseFunction(tokens);
        case "action":
            return parseAction(tokens);
        case "macro":
            return parseMacro(tokens);
        case "alpha":
            return parseReplacement(tokens, "\\alpha");
        case "beta":
            return parseReplacement(tokens, "\\beta");
        case "theta":
            return parseReplacement(tokens, "\\theta");
        case "phi":
            return parseReplacement(tokens, "\\phi");
        case "infinity":
            return parseReplacement(tokens, "\\infinity");
        case "pi":
            return parseReplacement(tokens, "\\pi");
        case "tau":
            return parseReplacement(tokens, "\\tau");
        case "if":
            return parseIf(tokens);
        default:
            throw new Error(`Unknown keyword ${tokens[0].value}`);
    }
}

function parseLet(tokens: Token[]): AST {
    return {
        type: ASTType.Declare,
        value: createSyntaxTree([tokens[1]]).value,
        parts: [createSyntaxTree(tokens.slice(3))]
    }
}

function parseFunction(tokens: Token[]): AST {
    const res: AST = {
        type: ASTType.Define,
        value: tokens[1].value,
        parts: []
    };

    const endParam: number = tokens.findIndex((v) => v.type == TokenType.ParenClose);

    for (let i = 3; i < endParam; i += 2) res.parts.push(createSyntaxTree([tokens[i]]));

    res.parts.push(createSyntaxTree(tokens.slice(endParam + 1)));

    return res;
}

function parseAction(tokens: Token[]): AST {
    const res: AST = {
        type: ASTType.ActionDefine,
        value: tokens[1].value,
        parts: []
    };

    const openParen: number = tokens.findIndex((v) => v.type == TokenType.ParenOpen);
    const closeParen: number = tokens.findIndex((v) => v.type == TokenType.ParenClose);
    const openBlock: number = tokens.findIndex((v) => v.type == TokenType.CurlyOpen);

    if (openBlock != closeParen + 1) throw new Error("Expected opening curly brace after parameter closing parenthesis.");

    for (let i = openParen + 1; i < closeParen; i += 2) res.parts.push(createSyntaxTree([tokens[i]]));

    res.parts.push({
        type: ASTType.EndParameters,
        value: null,
        parts: []
    });

    console.log(tokens, openBlock);

    const body: AST = createSyntaxTree(tokens.slice(openBlock + 1, -1));

    console.log(tokens.slice(openBlock + 1, -1), body);

    res.parts.push(body);

    return res;
}

function parseMacro(tokens: Token[]): AST {
    const res: AST = {
        type: ASTType.MacroDefine,
        value: tokens[1].value,
        parts: []
    };

    const openParen: number = tokens.findIndex((v) => v.type == TokenType.ParenOpen);
    const closeParen: number = tokens.findIndex((v) => v.type == TokenType.ParenClose);
    const openBlock: number = tokens.findIndex((v) => v.type == TokenType.CurlyOpen);

    if (openBlock != closeParen + 1) throw new Error("Expected opening curly brace after parameter closing parenthesis.");

    for (let i = openParen + 1; i < closeParen; i += 2) res.parts.push(createSyntaxTree([tokens[i]]));

    res.parts.push({
        type: ASTType.EndParameters,
        value: null,
        parts: []
    });

    const body: AST = createSyntaxTree(tokens.slice(openBlock + 1, -1));

    res.parts.push(body);

    return res;
}

function parseReplacement(tokens: Token[], replacement: string): AST {
    const newTokenList: Token[] = [...tokens];

    newTokenList[0] = {
        type: TokenType.LaTeX,
        value: replacement
    };

    return createSyntaxTree(newTokenList);
}

function parseLaTeX(tokens: Token[]): AST {
    if (tokens.length > 1) return parseNumberExpression(tokens);

    return {
        type: ASTType.LaTeX,
        value: tokens[0].value,
        parts: []
    };
}

function parseIndexing(tokens: Token[]): AST {
    const openBracket: number = tokens.findIndex((v, i) => i != 0 && v.type == TokenType.SquareOpen);

    console.log(tokens);

    return {
        type: ASTType.Index,
        value: null,
        parts: [
            createSyntaxTree(tokens.slice(0, openBracket)),
            createSyntaxTree(tokens.slice(openBracket + 1, -1))
        ]
    };
}

function parseIf(tokens: Token[]): AST {
    const res: AST = {
        type: ASTType.Conditional,
        value: null,
        parts: []
    };

    const openParen: number = tokens.findIndex((v) => v.type == TokenType.ParenOpen);
    const closeParen: number = tokens.findIndex((v) => v.type == TokenType.ParenClose);
    const openBlock: number = tokens.findIndex((v) => v.type == TokenType.CurlyOpen);
    const closeBlock: number = tokens.findIndex((v) => v.type == TokenType.CurlyClose);
    const elseStatements: number[] = tokens.flatMap((v, i) => v.type == TokenType.Keyword && (v.value == "else" || v.value == "elif") ? [i] : []);

    if (openBlock != closeParen + 1) throw new Error("Expected opening curly brace after parameter closing parenthesis.");

    res.parts.push(createSyntaxTree(tokens.slice(openParen + 1, closeParen)));
    res.parts.push(createSyntaxTree(tokens.slice(openBlock + 1, closeBlock)));
    if (elseStatements.length == 0) return res;
    if (elseStatements.length == 1) {
        if (tokens[elseStatements[0] + 1].type == TokenType.CurlyOpen) {
            res.parts.push(createSyntaxTree(tokens.slice(elseStatements[0] + 2, -1)));
            return res;
        }
    }

    if (tokens[elseStatements[0]].value != "elif") throw new Error("Expected elif preceding a conditional statement");

    res.parts.push(parseIf([
        { type: TokenType.Keyword, value: "if" },
        ...tokens.slice(elseStatements[0] + 1, -1)
    ]));

    return res;
}