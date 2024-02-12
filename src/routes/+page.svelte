<script lang="ts">
    import { generateTokens, type PositionedToken } from "$lib/lexer";
    import type { AST } from "$lib/AST";
    import { createSyntaxTree } from "$lib/parser";
    import { compile, compileFormat } from "$lib/compiler";

    const tokens: PositionedToken[] = generateTokens(`
        2 * x + 5;
    `);

    const ast: AST = createSyntaxTree(tokens);

    const res: string = compileFormat(compile(ast));
</script>

{ res }