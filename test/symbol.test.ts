import * as assert from "assert";

suite("Symbol", () =>
{
    const symbolName = "@nivinjoseph/n-ject/inject";
    
    test("Symbols must not be equal", () =>
    {
        const symbol1 = Symbol(symbolName);
        const symbol2 = Symbol(symbolName);

        assert.notStrictEqual(symbol1, symbol2);
    });

    test("Symbol descriptions must be equal", () =>
    {
        const symbol1 = Symbol(symbolName);
        const symbol2 = Symbol(symbolName);
        
        console.log(symbol1.toString(), symbol2.toString());
        assert.strictEqual(symbol1.toString(), symbol2.toString());
    });
    
    test("Global symbols must be equal", () =>
    {
        const symbol1 = Symbol.for(symbolName);
        const symbol2 = Symbol.for(symbolName);
        
        assert.strictEqual(symbol1, symbol2);
    });
});