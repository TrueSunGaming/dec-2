import { keywordTypes, operatorMap } from "$lib/data";
import { escapeRegExp } from "$lib/formatRegEx";
import * as monaco from "monaco-editor";

const monacoTokenMap: Map<RegExp, string> = new Map([
    [/\(|\)|\{|\}|\[|\]/g, "bracket"],
    [new RegExp(Array.from(keywordTypes.keys()).map(escapeRegExp).join("|"), "g"), "keyword"],
    [new RegExp(Array.from(operatorMap.keys()).map(escapeRegExp).join("|"), "g"), "operator"],
    [/[a-zA-Z]+([a-zA-Z\d]+)?/g, "identifier"],
    [/[\d.]+/g, "number"],
]);

monaco.languages.register({ id: "dec2" });

monaco.languages.setMonarchTokensProvider("dec2", {
    tokenizer: {
        root: Array.from(monacoTokenMap.entries())
    }
});

monaco.editor.defineTheme("dec2-theme", {
    base: "vs-dark",
    inherit: false,
    rules: [
        { token: "bracket" },
        { token: "keyword", foreground: "#dc52ff" }
    ],
    colors: {
        "editor.foreground": "#ffffff"
    }
});