import type { Token } from "$lib/lexer";
import { type AST, ASTType } from "./AST";
import { parseNumberExpression } from "./parseNumberExpression";

export function parseNumberStart(tokens: Token[]): AST {
    const res: AST = {
        type: ASTType.Program,
        parts: [],
        value: null
    };

    if (tokens.length == 1) {
        if (tokens[0].value == "...") {
            res.type = ASTType.Ellipsis;
            return res;
        }

        if (tokens[0].value.includes("e")) {
            return {
                type: ASTType.Multiply,
                value: null,
                parts: [
                    {
                        type: ASTType.NumberLiteral,
                        value: tokens[0].value.slice(0, tokens[0].value.indexOf("e")),
                        parts: []
                    },
                    {
                        type: ASTType.Exponent,
                        value: null,
                        parts: [
                            {
                                type: ASTType.NumberLiteral,
                                value: "10",
                                parts: []
                            },
                            {
                                type: ASTType.NumberLiteral,
                                value: tokens[0].value.slice(tokens[0].value.indexOf("e") + 1),
                                parts: []
                            }
                        ]
                    }
                ]
            };
        }

        res.type = ASTType.NumberLiteral;
        res.value = tokens[0].value;
        return res;
    }

    if (tokens.length > 1) return parseNumberExpression(tokens);

    return res;
}