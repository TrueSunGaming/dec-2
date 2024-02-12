export function desmosFormat(identifier: string): string {
    return identifier.length > 1 ? identifier[0] + "_{" + identifier.slice(1) + "}" : identifier;
}