<script lang="ts">
    import * as monaco from "monaco-editor";
    import { onMount } from "svelte";
    import "./monaco";

    let editorEl: HTMLDivElement;

    onMount(() => {
        monaco.editor.create(editorEl, {
            theme: "dec2-theme",
            language: "dec2"
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