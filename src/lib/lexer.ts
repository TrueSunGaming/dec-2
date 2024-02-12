import { keywordTypes, operatorMap } from "./data";
import { escapeRegExp } from "./formatRegEx";

export enum TokenType {
    Identifier,
    Number,
    ParenOpen,
    ParenClose,
    CurlyOpen,
    CurlyClose,
    SquareOpen,
    SquareClose,
    Separator,
    EOL,
    Keyword,
    Operator
}

export interface Token {
    value: string;
    type: TokenType; 
}

export interface PositionedToken extends Token {
    position: number;
}

const tokenMap: Map<RegExp, TokenType> = new Map([
    [/[a-zA-Z]+([a-zA-Z\d]+)?/g, TokenType.Identifier],
    [/\d+/g, TokenType.Number],
    [/\(/g, TokenType.ParenOpen],
    [/\)/g, TokenType.ParenClose],
    [/\{/g, TokenType.CurlyOpen],
    [/\}/g, TokenType.CurlyClose],
    [/\[/g, TokenType.SquareOpen],
    [/\]/g, TokenType.SquareClose],
    [/,/g, TokenType.Separator],
    [/;/g, TokenType.EOL],
    [new RegExp(Array.from(keywordTypes.keys()).map(escapeRegExp).join("|"), "g"), TokenType.Keyword],
    [new RegExp(Array.from(operatorMap.keys()).map(escapeRegExp).join("|"), "g"), TokenType.Operator],
]);

export function generateTokens(str: string): PositionedToken[] {
    const res: PositionedToken[] = [];

    for (const [regex, type] of tokenMap.entries()) {
        let match: RegExpExecArray | null;
        while ((match = regex.exec(str))) {
            if (type == TokenType.Identifier && Array.from(keywordTypes.keys()).includes(match[0])) continue;
            res.push({ value: match[0], type, position: match.index });
        }
    }

    return res.sort((a, b) => a.position - b.position);
}