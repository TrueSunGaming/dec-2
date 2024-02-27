import type { AST } from "./AST";
import type { Token } from "$lib/lexer";
import { parseAction } from "./keywords/action";
import { parseFunction } from "./keywords/function";
import { parseIf } from "./keywords/if";
import { parseLet } from "./keywords/let";
import { parseMacro } from "./keywords/macro";
import { parseReplacement } from "./keywords/replacement";

export function parseKeyword(tokens: Token[]): AST {
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
        case "inf":
            return parseReplacement(tokens, "\\infinity");
        case "pi":
            return parseReplacement(tokens, "\\pi");
        case "tau":
            return parseReplacement(tokens, "\\tau");
        case "e":
            return parseReplacement(tokens, "e");
        case "if":
            return parseIf(tokens);
        default:
            throw new Error(`Unknown keyword ${tokens[0].value}`);
    }
}