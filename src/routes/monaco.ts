import { keywordTypes, operatorMap, stdlibName } from "$lib/data";
import { escapeRegExp } from "$lib/formatRegEx";
import type * as Monaco from "monaco-editor/esm/vs/editor/editor.api";

export async function initMonaco(): Promise<typeof Monaco> {
    const monaco: typeof Monaco = (await import("$lib/monacoLoad")).default;

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
        provideCompletionItems: (model: Monaco.editor.ITextModel, position: Monaco.Position) => {
            const word: Monaco.editor.IWordAtPosition = model.getWordUntilPosition(position);
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
    
                    ...Array.from(stdlibName.entries()).map(([k, v]) => {
                        const param: string[] = v.map((w, i) => `\${${i + 1}:${w}}`);
    
                        return {
                            label: k,
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: k + `(${param.join(", ")})`,
                            range,
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        }
                    }),
                ]
            }
        }
    });
    
    return monaco;
}