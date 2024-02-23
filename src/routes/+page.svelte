<script lang="ts">
    import { onMount } from "svelte";
    import { initMonaco } from "./monaco";
    import { fullCompile } from "$lib/compiler";
    import type * as Monaco from "monaco-editor/esm/vs/editor/editor.api";

    let editorEl: HTMLDivElement;

    onMount(async () => {
        const monaco: typeof Monaco = await initMonaco();

        const editor: Monaco.editor.IStandaloneCodeEditor = monaco.editor.create(editorEl, {
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

            run: (ed: Monaco.editor.IStandaloneCodeEditor) => {
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