import * as assert from "assert";
import ComponentRegistry from "./../src/component-registry";
import { Container, Lifestyle } from "./../src/index";

suite("ComponentRegistry", () =>
{
    let cr: ComponentRegistry;

    setup(() =>
    {
        cr = new ComponentRegistry();
    });
    
    suite("Dependency graph", () =>
    {
        test("Given Tree verification, should succeed", () =>
        {
            class A { public constructor(b: B, c: C) { } }
            class B { }
            class C { }

            cr.register("a", A, Lifestyle.Transient);
            cr.register("b", B, Lifestyle.Transient);
            cr.register("c", C, Lifestyle.Transient);
            cr.verifyRegistrations();

            assert.ok(true);
        });

        test("Given DAG verification, should succeed", () =>
        {
            class A { public constructor(b: B, c: C) { } }
            class B { public constructor(c: C) { } }
            class C { }

            cr.register("a", A, Lifestyle.Transient);
            cr.register("b", B, Lifestyle.Transient);
            cr.register("c", C, Lifestyle.Transient);
            cr.verifyRegistrations();

            assert.ok(true);
        });

        test("Given DCG verification, should fail", () =>
        {
            class A { public constructor(b: B) { } }
            class B { public constructor(c: C) { } }
            class C { public constructor(a: A) { } }

            assert.throws(() =>
            {
                cr.register("a", A, Lifestyle.Transient);
                cr.register("b", B, Lifestyle.Transient);
                cr.register("c", C, Lifestyle.Transient);
                cr.verifyRegistrations();
            });
        });

        test("Given DCG (immediate cycle) verification, should fail", () =>
        {
            class A { public constructor(b: B, c: C) { } }
            class B { public constructor(c: C) { } }
            class C { public constructor(a: A) { } }

            assert.throws(() =>
            {
                cr.register("a", A, Lifestyle.Transient);
                cr.register("b", B, Lifestyle.Transient);
                cr.register("c", C, Lifestyle.Transient);
                cr.verifyRegistrations();
            });
        });

        test("Given DCG (late cycle) verification, should fail", () =>
        {
            class A { public constructor(b: B, c: C) { } }
            class B { public constructor(c: C) { } }
            class C { public constructor(d: D) { } }
            class D { public constructor(a: A) { } }

            assert.throws(() =>
            {
                cr.register("a", A, Lifestyle.Transient);
                cr.register("b", B, Lifestyle.Transient);
                cr.register("c", C, Lifestyle.Transient);
                cr.register("d", D, Lifestyle.Transient);
                cr.verifyRegistrations();
            });
        });

        test("Given DCG (self cycle) verification, should fail", () =>
        {
            class A { public constructor(b: B, c: C) { } }
            class B { public constructor(c: C, b: B) { } }
            class C { }

            assert.throws(() =>
            {
                cr.register("a", A, Lifestyle.Transient);
                cr.register("b", B, Lifestyle.Transient);
                cr.register("c", C, Lifestyle.Transient);
                cr.verifyRegistrations();
            });
        });
    }); 
    
    suite("Dependency Lifestyle", () =>
    {
        class A { public constructor(b: B) { } }
        class B { }
        
        suite("Singleton", () =>
        {
            setup(() =>
            {
                cr.register("a", A, Lifestyle.Singleton);
            });
            
            // Singleton -> Singleton
            test("Given the singleton to singleton dependency, should succeed", () =>
            {
                cr.register("b", B, Lifestyle.Singleton);
                cr.verifyRegistrations();
                
                assert.ok(true);
            });
            
            // Singleton -> Scoped
            test("Given the singleton to scoped dependency, should fail", () =>
            {
                cr.register("b", B, Lifestyle.Scoped);
                
                assert.throws(() =>
                {
                    cr.verifyRegistrations();
                });
            });
            
            // Singleton -> Transient
            test("Given the singleton to transient dependency, should succeed", () =>
            {
                cr.register("b", B, Lifestyle.Transient);
                cr.verifyRegistrations();
                
                assert.ok(true);
            });
        });
        
        suite("Scoped", () =>
        {
            setup(() =>
            {
                cr.register("a", A, Lifestyle.Scoped);
            });
            
            // Scoped -> Singleton
            test("Given the scoped to singleton dependency, should succeed", () =>
            {
                cr.register("b", B, Lifestyle.Singleton);
                cr.verifyRegistrations();
                
                assert.ok(true);
            });
            
            // Scoped -> Scoped
            test("Given the scoped to scoped dependency, should succeed", () =>
            {
                cr.register("b", B, Lifestyle.Scoped);
                cr.verifyRegistrations();
                
                assert.ok(true);
            });
            
            // Scoped -> Transient
            test("Given the scoped to transient dependency, should succeed", () =>
            {
                cr.register("b", B, Lifestyle.Transient);
                cr.verifyRegistrations();
                
                assert.ok(true);
            });
        });
        
        suite("Transient", () =>
        {
            setup(() =>
            {
                cr.register("a", A, Lifestyle.Transient);
            });
            
            // Transient -> Singleton
            test("Given the transient to singleton dependency, should succeed", () =>
            {
                cr.register("b", B, Lifestyle.Singleton);
                cr.verifyRegistrations();
                
                assert.ok(true);
            });
            
            // Transient -> Scoped
            test("Given the transient to scoped dependency, should succeed", () =>
            {
                cr.register("b", B, Lifestyle.Scoped);
                cr.verifyRegistrations();
                
                assert.ok(true);
            });
            
            // Transient -> Transient
            test("Given the transient to transient dependency, should succeed", () =>
            {
                cr.register("b", B, Lifestyle.Transient);
                cr.verifyRegistrations();
                
                assert.ok(true);
            });
        });
    });
});