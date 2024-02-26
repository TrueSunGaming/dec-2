export function desmosFormat(identifier: string): string {
    if (identifier.startsWith("\\")) return identifier;
    return identifier.length > 1 ? identifier[0] + "_{" + identifier.slice(1) + "}" : identifier;
}