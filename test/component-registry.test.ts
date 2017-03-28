import * as assert from "assert";
import ComponentRegistry from "./../src/component-registry";
import Lifestyle from "./../src/lifestyle";

suite("ComponentRegistry", () =>
{
    suite("Dependency graph", () =>
    {
        test("Given Tree verification should succeed", () =>
        {
            class A { public constructor(b: B, c: C) { } }
            class B { }
            class C { }

            let cr = new ComponentRegistry();
            cr.register("a", A, Lifestyle.Transient);
            cr.register("b", B, Lifestyle.Transient);
            cr.register("c", C, Lifestyle.Transient);
            cr.verifyRegistrations();

            assert.ok(true);
        });

        test("Given DAG verification should succeed", () =>
        {
            class A { public constructor(b: B, c: C) { } }
            class B { public constructor(c: C) { } }
            class C { }

            let cr = new ComponentRegistry();
            cr.register("a", A, Lifestyle.Transient);
            cr.register("b", B, Lifestyle.Transient);
            cr.register("c", C, Lifestyle.Transient);
            cr.verifyRegistrations();

            assert.ok(true);
        });

        test("Given DCG verification should fail", () =>
        {
            class A { public constructor(b: B) { } }
            class B { public constructor(c: C) { } }
            class C { public constructor(a: A) { } }

            assert.throws(() =>
            {
                let cr = new ComponentRegistry();
                cr.register("a", A, Lifestyle.Transient);
                cr.register("b", B, Lifestyle.Transient);
                cr.register("c", C, Lifestyle.Transient);
                cr.verifyRegistrations();
            });
        });

        test("Given DCG (immediate cycle) verification should fail", () =>
        {
            class A { public constructor(b: B, c: C) { } }
            class B { public constructor(c: C) { } }
            class C { public constructor(a: A) { } }

            assert.throws(() =>
            {
                let cr = new ComponentRegistry();
                cr.register("a", A, Lifestyle.Transient);
                cr.register("b", B, Lifestyle.Transient);
                cr.register("c", C, Lifestyle.Transient);
                cr.verifyRegistrations();
            });
        });

        test("Given DCG (late cycle) verification should fail", () =>
        {
            class A { public constructor(b: B, c: C) { } }
            class B { public constructor(c: C) { } }
            class C { public constructor(d: D) { } }
            class D { public constructor(a: A) { } }

            assert.throws(() =>
            {
                let cr = new ComponentRegistry();
                cr.register("a", A, Lifestyle.Transient);
                cr.register("b", B, Lifestyle.Transient);
                cr.register("c", C, Lifestyle.Transient);
                cr.register("d", D, Lifestyle.Transient);
                cr.verifyRegistrations();
            });
        });

        test("Given DCG (self cycle) verification should fail", () =>
        {
            class A { public constructor(b: B, c: C) { } }
            class B { public constructor(c: C, b: B) { } }
            class C { }

            assert.throws(() =>
            {
                let cr = new ComponentRegistry();
                cr.register("a", A, Lifestyle.Transient);
                cr.register("b", B, Lifestyle.Transient);
                cr.register("c", C, Lifestyle.Transient);
                cr.verifyRegistrations();
            });
        });
    }); 
});