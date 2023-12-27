import assert from "node:assert";
import { describe, test } from "node:test";

await describe("Symbol", async () =>
{
    const symbolName = "@nivinjoseph/n-ject/inject";

    await test("Symbols must not be equal", () =>
    {
        const symbol1 = Symbol(symbolName);
        const symbol2 = Symbol(symbolName);

        assert.notStrictEqual(symbol1, symbol2);
    });

    await test("Symbol descriptions must be equal", () =>
    {
        const symbol1 = Symbol(symbolName);
        const symbol2 = Symbol(symbolName);

        console.log(symbol1.toString(), symbol2.toString());
        assert.strictEqual(symbol1.toString(), symbol2.toString());
    });

    await test("Global symbols must be equal", () =>
    {
        const symbol1 = Symbol.for(symbolName);
        const symbol2 = Symbol.for(symbolName);

        assert.strictEqual(symbol1, symbol2);
    });
});