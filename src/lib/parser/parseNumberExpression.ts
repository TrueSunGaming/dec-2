import { ASTType, type AST } from "./AST";
import { OperationType, Operator, operatorAST, operatorMap, orderOfOperations } from "$lib/data";
import { TokenType, type Token } from "$lib/lexer";
import { parseIndexing } from "./parseIndexing";
import { parseLaTeX } from "./parseLaTeX";
import { createSyntaxTree } from "./parser";

export function parseNumberExpression(tokens: Token[]): AST {
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

    if (operatorMap.get(lastOperation[0]) == Operator.TernaryElse) {
        const qmark: number = tokens.findIndex((v) => v.value == "?");
        if (qmark == -1) throw new Error("Expected starting ternary operator.");

        return {
            type: ASTType.Conditional,
            value: null,
            parts: [
                createSyntaxTree(tokens.slice(0, qmark)),
                createSyntaxTree(tokens.slice(qmark + 1, lastOperation[1])),
                createSyntaxTree(tokens.slice(lastOperation[1] + 1)),
            ]
        };
    }

    res.type = operatorAST.get(lastOperation[0])!;
    res.parts = [
        createSyntaxTree(tokens.slice(0, lastOperation[1])),
        createSyntaxTree(tokens.slice(lastOperation[1] + 1))
    ];

    return res;
}