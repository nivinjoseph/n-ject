import assert from "node:assert";
import { describe, test } from "node:test";
import { ComponentRegistry } from "./../../src/component-registry.js";
import { Lifestyle } from "./../../src/lifestyle.js";
import { A } from "./a.js";
import { B } from "./b.js";
import { C } from "./c.js";
import { D } from "./d.js";
import { E } from "./e.js";


await describe.only("ES6 tests", async () =>
{
    await test.only("test", async () =>
    {
        const cr = new ComponentRegistry();
        cr.register("A", A, Lifestyle.Transient);
        cr.register("B", B, Lifestyle.Transient);
        cr.register("C", C, Lifestyle.Transient);
        cr.register("D", D, Lifestyle.Transient);
        cr.register("E", E, Lifestyle.Transient);

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
        
        const resolvedD = cr.find("D");
        assert.ok(resolvedD != null);
        assert.ok(resolvedD.dependencies.length === 1);
        assert.ok(resolvedD.dependencies.takeFirst() === "C");
        
        const resolvedE = cr.find("E");
        assert.ok(resolvedE != null);
        assert.ok(resolvedE.dependencies.length === 1);
        assert.ok(resolvedE.dependencies.takeFirst() === "A");

        await cr.dispose();

        assert.ok(true);
    });
});