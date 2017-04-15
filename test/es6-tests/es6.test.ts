import * as assert from "assert";
import { ComponentRegistry } from "./../../src/component-registry";
import { Lifestyle } from "./../../src/lifestyle";
import { A } from "./a";
import { B } from "./b";
import { C } from "./c";

suite("ES6 tests", () =>
{
    test("test", () =>
    {
        let cr = new ComponentRegistry();
        cr.register("A", A, Lifestyle.Transient);
        cr.register("B", B, Lifestyle.Transient);
        cr.register("C", C, Lifestyle.Transient);
        
        cr.verifyRegistrations();

        assert.ok(true);
    }); 
});