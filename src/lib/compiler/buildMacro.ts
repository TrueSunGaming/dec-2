import type { AST } from "$lib/parser/AST";
import { buildMacroFromAST } from "./buildMacroFromAST";
import { macros } from "./compiler";

export function buildMacro(name: string, params: AST[]): AST {
    return buildMacroFromAST(structuredClone(macros.get(name)![1]), new Map(params.map((v, i) => [
        macros.get(name)![0][i],
        v
    ])));
}