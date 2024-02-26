import { macroReplaceable } from "$lib/data";
import type { AST } from "$lib/parser/AST";

export function buildMacroFromAST(ast: AST, paramMap: Map<string, AST>): AST {
    const res: AST = structuredClone(ast);

    for (let i = 0; i < res.parts.length; i++) {
        if (macroReplaceable.includes(res.parts[i].type) && paramMap.has(res.parts[i].value ?? "")) {
            res.parts[i].value = paramMap.get(res.parts[i].value ?? "")!.value;
        }

        res.parts[i] = buildMacroFromAST(res.parts[i], paramMap);
    }

    return res;
}