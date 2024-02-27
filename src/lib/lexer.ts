import { keywords } from "./data/data";
import { escapeRegExp } from "./formatRegEx";
import { range } from "./range";
import { operatorMap } from "./data/operators";

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
    Operator,
    LaTeX
}

export interface Token {
    value: string;
    type: TokenType; 
}

export interface PositionedToken extends Token {
    position: number;
}

const tokenMap: Map<RegExp, TokenType> = new Map([
    [/\(/g, TokenType.ParenOpen],
    [/\)/g, TokenType.ParenClose],
    [/\{/g, TokenType.CurlyOpen],
    [/\}/g, TokenType.CurlyClose],
    [/\[/g, TokenType.SquareOpen],
    [/\]/g, TokenType.SquareClose],
    [/,/g, TokenType.Separator],
    [/;/g, TokenType.EOL],
    [new RegExp(keywords.map(escapeRegExp).join("|"), "g"), TokenType.Keyword],
    [new RegExp(Array.from(operatorMap.keys()).map(escapeRegExp).join("|"), "g"), TokenType.Operator],
    [/[a-zA-Z]+([a-zA-Z\d]+)?/g, TokenType.Identifier],
    [/[\d.]+/g, TokenType.Number],
]);

export function generateTokens(str: string): PositionedToken[] {
    const res: PositionedToken[] = [];

    const quotes: [number, number][] = [];
    let insideQuote = false;

    for (let i = 0; i < str.length; i++) {
        if (str[i] != "\"") continue;

        if (insideQuote) {
            quotes.at(-1)![1] = i;
            res.push({
                type: TokenType.LaTeX,
                value: str.substring(quotes.at(-1)![0] + 1, i),
                position: quotes.at(-1)![0] + 1,
            });
        } else quotes.push([i, -1]);

        insideQuote = !insideQuote;
    }

    const searchedIndexes: number[][] = [];

    for (const [regex, type] of tokenMap.entries()) {
        let match: RegExpExecArray | null;
        while ((match = regex.exec(str))) {
            if (quotes.some((v) => match!.index >= v[0] && match!.index <= v[1])) continue;
            const indexes: number[] = range(match.index, match.index + match[0].length);
            if (searchedIndexes.flat().filter((v) => indexes.includes(v)).length > 0) continue;

            res.push({ value: match[0], type, position: match.index });
            searchedIndexes.push(indexes);
        }
    }

    return res.sort((a, b) => a.position - b.position);
}