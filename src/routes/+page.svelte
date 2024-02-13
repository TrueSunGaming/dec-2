<script lang="ts">
    import { generateTokens, type PositionedToken } from "$lib/lexer";
    import type { AST } from "$lib/AST";
    import { createSyntaxTree } from "$lib/parser";
    import { compile, compileFormat } from "$lib/compiler";

    const tokens: PositionedToken[] = generateTokens(`
        let m = 1;
        let b = 0;
        let y = m * x + b;
        let level10KaiCenatGyattOnlyInOhio = 1;

        action skibidiRizz(x) {
            m += x;
            b += x;
        };

        skibidiRizz(level10KaiCenatGyattOnlyInOhio);
    `);

    console.log(tokens);

    const ast: AST = createSyntaxTree(tokens);

    console.log(ast);

    const res: string = compileFormat(compile(ast));
</script>

{ @html res.replace(/\n/g, "<br>") }

<pre>{ JSON.stringify(tokens, null, 2) }</pre>
<pre>{ JSON.stringify(ast, null, 2) }</pre>