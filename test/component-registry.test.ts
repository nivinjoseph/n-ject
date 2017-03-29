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
    suite("Lifestyle Dependency", () =>
    {
        suite("Singleton", () =>
        {
            test("Singleton to Singleton", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                let cr = new ComponentRegistry();
                cr.register("a", A, Lifestyle.Singleton);
                cr.register("b", B, Lifestyle.Singleton);
                cr.verifyRegistrations();
                
                assert.ok(true);
            });
            test("Singleton to Singleton - Root", () =>
            {
                
            });
            test("Singleton to Singleton - Child", () =>
            {

            });
            test("Singleton to Scoped", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }
                
                let cr = new ComponentRegistry();
                cr.register("a", A, Lifestyle.Singleton);
                cr.register("b", B, Lifestyle.Scoped);
                cr.verifyRegistrations();

                assert.ok(true);
            });
            test("Singleton to Scoped - Root", () =>
            {

            });
            test("Singleton to Scoped - Child", () =>
            {

            });
            test("Singleton to Transient", () =>
            {

            });
            test("Singleton to Transient - Root", () =>
            {

            });
            test("Singleton to Transient - Child", () =>
            {

            });
        });
        
        suite("Scoped", () =>
        {
            test("Scoped to Singleton", () =>
            {

            });
            test("Scoped to Singleton - Root", () =>
            {

            });
            test("Scoped to Singleton - Child", () =>
            {

            });
            test("Scoped to Scoped", () =>
            {

            });
            test("Scoped to Scoped - Root", () =>
            {

            });
            test("Scoped to Scoped - Child", () =>
            {

            });
            test("Scoped to Transient", () =>
            {

            });
            test("Scoped to Transient - Root", () =>
            {

            });
            test("Scoped to Transient - Child", () =>
            {

            });
        });
        
        suite("Transient", () =>
        {
            test("Transient to Singleton", () =>
            {

            });
            test("Transient to Singleton - Root", () =>
            {

            });
            test("Transient to Singleton - Child", () =>
            {

            });
            test("Transient to Scoped", () =>
            {

            });
            test("Transient to Scoped - Root", () =>
            {

            });
            test("Transient to Scoped - Child", () =>
            {

            });
            test("Transient to Transient", () =>
            {

            });
            test("Transient to Transient - Root", () =>
            {

            });
            test("Transient to Transient - Child", () =>
            {

            });
        });
    });
});