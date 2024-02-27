import { keywords } from "$lib/data/data";
import { stdlibName } from "$lib/data/stdlib";
import type * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
import { TokenType, tokenMap } from "$lib/lexer";

export async function initMonaco(): Promise<typeof Monaco> {
    const monaco: typeof Monaco = (await import("$lib/monacoLoad")).default;

    const monacoTokenMap: Map<RegExp, string> = new Map([
        [/\(|\)|\{|\}|\[|\]/g, "@brackets"],
        [Array.from(tokenMap.entries()).find((v) => v[1] == TokenType.Keyword)![0], "keyword"],
        [Array.from(tokenMap.entries()).find((v) => v[1] == TokenType.Operator)![0], "operator"],
        [Array.from(tokenMap.entries()).find((v) => v[1] == TokenType.Identifier)![0], "identifier"],
        [Array.from(tokenMap.entries()).find((v) => v[1] == TokenType.Number)![0], "number"],
        [/"(.*?)"/g, "string"]
    ]);
    
    monaco.languages.register({ id: "dec2" });
    
    monaco.languages.setMonarchTokensProvider("dec2", {
        tokenizer: {
            root: Array.from(monacoTokenMap.entries())
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
                    ...keywords.map((v) => ({
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