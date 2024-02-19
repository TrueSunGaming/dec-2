import { keywordTypes, operatorMap, stdlib } from "$lib/data";
import { escapeRegExp } from "$lib/formatRegEx";
import * as monaco from "monaco-editor";

const monacoTokenMap: Map<RegExp, string> = new Map([
    [/\(|\)|\{|\}|\[|\]/g, "@brackets"],
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
        { token: "keyword", foreground: "#dc52ff" },
        { token: "operator", foreground: "#00d0d0" },
        { token: "identifier", foreground: "#ff5050" },
        { token: "number", foreground: "#80ff80" },
    ],
    colors: {
        "editor.foreground": "#ffffff"
    }
});

monaco.languages.setLanguageConfiguration("dec2", {
    surroundingPairs: [
        {
            open: "(",
            close: ")"
        },
        {
            open: "{",
            close: "}"
        },
        {
            open: "[",
            close: "]"
        }
    ],

    autoClosingPairs: [
        {
            open: "(",
            close: ")"
        },
        {
            open: "{",
            close: "}"
        },
        {
            open: "[",
            close: "]"
        }
    ],

    brackets: [
        ["(", ")"],
        ["[", "]"],
        ["{", "}"]
    ]
});

monaco.languages.registerCompletionItemProvider("dec2", {
    provideCompletionItems: (model: monaco.editor.ITextModel, position: monaco.Position) => {
        const word: monaco.editor.IWordAtPosition = model.getWordUntilPosition(position);
		const range = {
			startLineNumber: position.lineNumber,
			endLineNumber: position.lineNumber,
			startColumn: word.startColumn,
			endColumn: word.endColumn,
		};

        return {
            suggestions: [
                ...Array.from(keywordTypes.keys()).map((v) => ({
                    label: v,
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: v,
                    range
                })),

                ...Array.from(stdlib.keys()).map((v) => {
                    const compiled: string = stdlib.get(v)!;

                    const count: number = (compiled.match(/%%\d%%/g) || []).length;
                    const param: string[] = [];

                    for (let i = 1; i <= count; i++) {
                        param.push(`\${${i}:param}`)
                    }

                    return {
                        label: v,
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: v + `(${param.join(", ")})`,
                        range,
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    }
                }),
            ]
        }
    }
})