<script lang="ts">
    import { onMount } from "svelte";
    import "./style.scss";
    
    onMount(() => import("$lib/monacoLoad"));
</script>

<slot />