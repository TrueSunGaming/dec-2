<script lang="ts">
    import * as monaco from "monaco-editor";
    import { onMount } from "svelte";
    import "./monaco";
    import { fullCompile } from "$lib/compiler";

    let editorEl: HTMLDivElement;

    onMount(() => {
        const editor: monaco.editor.IStandaloneCodeEditor = monaco.editor.create(editorEl, {
            theme: "vs-dark",
            language: "dec2"
        });

        editor.addAction({
            id: "compile",
            label: "Compile",
            keybindings: [
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR
            ],
            contextMenuGroupId: "compile",

            run: (ed: monaco.editor.IStandaloneCodeEditor) => {
                const win: Window = window.open("about:blank", "_blank")!;

                win.document.body.innerText = fullCompile(ed.getValue());
            }
        });
    });
</script>

<div bind:this={ editorEl }></div>

<style lang="scss">
    div {
        height: 100vh;
        width: 80vw;
    }
</style>