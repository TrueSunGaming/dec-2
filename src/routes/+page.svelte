<script lang="ts">
    import { generateTokens, type PositionedToken } from "$lib/lexer";
    import type { AST } from "$lib/AST";
    import { createSyntaxTree } from "$lib/parser"

    const tokens: PositionedToken[] = generateTokens(`
        f(x) + 2;
    `);

    const ast: AST = createSyntaxTree(tokens);

    console.log(ast);
</script>