import { ASTType, type AST } from "./AST";
import { TokenType, type Token } from "../lexer";
import { parseNumberStart } from "./parseNumberStart";
import { splitTokens } from "./splitTokens";
import { parseLaTeX } from "./parseLaTeX";
import { parseIdentifierStart } from "./parseIndentifierStart";
import { parseParentheses } from "./parseParentheses";
import { parseSquare } from "./parseSquare";
import { parseKeyword } from "./parseKeyword";

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