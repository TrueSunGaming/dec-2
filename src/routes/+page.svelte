<script lang="ts">
    import { generateTokens, type PositionedToken } from "$lib/lexer";
    import type { AST } from "$lib/AST";
    import { createSyntaxTree } from "$lib/parser";
    import { compile, compileFormat } from "$lib/compiler";

    const tokens: PositionedToken[] = generateTokens(`
        function skibidi(rizz, gyatt) rizz ^ gyatt;
        skibidi(x, y) > 5;
    `);

    console.log(tokens);

    const ast: AST = createSyntaxTree(tokens);

    console.log(ast);

    const res: string = compileFormat(compile(ast));
</script>

{ @html res.replace(/\n/g, "<br>") }