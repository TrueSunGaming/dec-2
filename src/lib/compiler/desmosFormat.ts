export function desmosFormat(identifier: string): string {
    if (identifier.startsWith("\\")) return identifier;
    return identifier.length > 1 ? identifier[0] + "_{" + identifier.slice(1) + "}" : identifier;
}

export function compileFormat(res: string): string {
    const parenPairs: [number, number, number][] = [];
    let depth = 0;

    for (let i = 0; i < res.length; i++) {
        if (res[i] == "(") {
            depth++;
            parenPairs.push([i, -1, depth]);
        }

        if (res[i] == ")") {
            parenPairs[parenPairs.findLastIndex((v) => v[2] == depth)][1] = i;
            depth--;
        }
    }

    for (let i = 1; i < parenPairs.length; i++) {
        if (parenPairs[i][0] != parenPairs[i - 1][0] + 1 || parenPairs[i][1] != parenPairs[i - 1][1] - 1) continue;

        res = res.slice(0, parenPairs[i][0]) + "?" + res.slice(parenPairs[i][0] + 1);
        res = res.slice(0, parenPairs[i][1]) + "?" + res.slice(parenPairs[i][1] + 1);
    }

    return res
        .replace(/\?/g, "")
        .replace(/\(/g, "\\left(")
        .replace(/\)/g, "\\right)")
        .replace(/\[/g, "\\left[")
        .replace(/\]/g, "\\right]")
        .replace(/\\\{/g, "\\left\\{")
        .replace(/\\\}/g, "\\right\\}");
}