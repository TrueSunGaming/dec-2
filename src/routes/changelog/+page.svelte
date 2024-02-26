<svelte:head>
    <title>Changelog | Desmos Expression Compiler</title>
</svelte:head>

<h1>Changelog</h1>

<hr>

<h2>Desmos Expression Compiler 2.1.0</h2>
<ul>
    <li>
        Add LaTeX expressions using quotation marks (e.g. <code>"y=2x\{"{"}x{">"}5\{"}"}"</code>),
        <code>\left</code> and <code>\right</code> annotations are added automatically
    </li>
    <li>Change Greek letters and <code>infinity</code> from stdlib functions to keywords</li>
    <li>Add changelog</li>
    <li>Add <code>length</code> stdlib function</li>
    <li>Add square bracket syntax for indexing lists (e.g. <code>list[index]</code>), which is always 0-indexed</li>
    <li>Remove <code>index</code> and <code>index1</code> stdlib functions</li>
    <li>Add <code>factorial</code> stdlib function</li>
    <li>Add <code>if</code>/<code>elif</code>/<code>else</code> statements</li>
    <li>Add ternary operator (<code>x {">"} 1 ? 2 : 3</code>)</li>
    <li>Remove <code>ternary</code> stdlib function</li>
</ul>

<hr>

<h2>Desmos Expression Compiler 2.0.0</h2>
<p>Full rewrite of the original Desmos Expression Compiler using a C-like syntax</p>