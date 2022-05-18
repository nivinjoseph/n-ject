import * as assert from "assert";
import { ComponentRegistry } from "./../../src/component-registry";
import { Lifestyle } from "./../../src/lifestyle";
import { A } from "./a";
import { B } from "./b";
import { C } from "./c";


suite("ES6 tests", () =>
{
    test("test", async () =>
    {
        const cr = new ComponentRegistry();
        cr.register("A", A, Lifestyle.Transient);
        cr.register("B", B, Lifestyle.Transient);
        cr.register("C", C, Lifestyle.Transient);
        
        cr.verifyRegistrations();
        
        const resolvedA = cr.find("A");
        assert.ok(resolvedA != null);
        assert.ok(resolvedA.dependencies.length === 2);
        
        
        const resolvedB = cr.find("B");
        assert.ok(resolvedB != null);
        assert.ok(resolvedB.dependencies.length === 0);
        
        const resolvedC = cr.find("C");
        assert.ok(resolvedC != null);
        assert.ok(resolvedC.dependencies.length === 0);
        
        await cr.dispose();

        assert.ok(true);
    }); 
});