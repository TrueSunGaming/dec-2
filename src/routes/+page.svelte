<script lang="ts">
    import * as monaco from "monaco-editor";
    import { onMount } from "svelte";

    let editorEl: HTMLDivElement;

    onMount(() => {
        monaco.editor.create(editorEl);
    });
</script>

<div bind:this={ editorEl }></div>

<style lang="scss">
    div {
        height: 100vh;
        position: absolute;
        left: 0;
        top: 0;
    }
</style>