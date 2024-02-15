<script lang="ts">
    import { generateTokens, type PositionedToken } from "$lib/lexer";
    import type { AST } from "$lib/AST";
    import { createSyntaxTree } from "$lib/parser";
    import { compile, compileFormat } from "$lib/compiler";

    const tokens: PositionedToken[] = generateTokens(`
        map([(1, 1), (2, 2), (3, 3)], i, 2 * i);
    `);

    const ast: AST = createSyntaxTree(tokens);

    const res: string = compileFormat(compile(ast));
</script>

{ @html res.replace(/\n/g, "<br>") }

<pre>{ JSON.stringify(tokens, null, 2) }</pre>
<pre>{ JSON.stringify(ast, null, 2) }</pre>