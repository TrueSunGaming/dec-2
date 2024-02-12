export function desmosFormat(identifier: string): string {
    return identifier[0] + "_{" + identifier.slice(1) + "}";
}