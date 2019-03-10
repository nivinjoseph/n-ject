import * as assert from "assert";
import { ComponentRegistry } from "./../src/component-registry";
import { Lifestyle } from "./../src/lifestyle";
import { inject } from "./../src/inject";

// registered dependant but not dependency

suite("ComponentRegistry", () =>
{
    let cr: ComponentRegistry;

    setup(() =>
    {
        cr = new ComponentRegistry();
    });
    
    teardown(async () =>
    {
        await cr.dispose();
    });
    
    suite("Registry Validation", () =>
    {
        test("Should throw exception when dependant A is registered but dependancy B is not", () =>
        {
            class B { }
            @inject("b")
                // @ts-ignore
            class A { public constructor(b: B) { } }
            
            cr.register("a", A, Lifestyle.Transient);
            assert.throws(() =>
            {
                cr.verifyRegistrations();
            });
        });
    });
    
    suite("Dependency graph", () =>
    {
        test("Given Tree verification, should succeed", () =>
        {
            class B { }
            class C { }
            @inject("b", "c")
                // @ts-ignore
            class A { public constructor(b: B, c: C) { } }

            cr.register("a", A, Lifestyle.Transient);
            cr.register("b", B, Lifestyle.Transient);
            cr.register("c", C, Lifestyle.Transient);
            cr.verifyRegistrations();

            assert.ok(true);
        });

        test("Given DAG verification, should succeed", () =>
        {
            class C { }
            @inject("c")
            // @ts-ignore
            class B { public constructor(c: C) { } }
            @inject("b", "c")
                // @ts-ignore
            class A { public constructor(b: B, c: C) { } }

            cr.register("a", A, Lifestyle.Transient);
            cr.register("b", B, Lifestyle.Transient);
            cr.register("c", C, Lifestyle.Transient);
            cr.verifyRegistrations();

            assert.ok(true);
        });

        test("Given DCG verification, should fail", () =>
        {
            @inject("a")
            // @ts-ignore
            class C { public constructor(a: any) { } }
            @inject("c")
            // @ts-ignore
            class B { public constructor(c: C) { } }
            @inject("b")
                // @ts-ignore
            class A { public constructor(b: B) { } }

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
            @inject("a")
            // @ts-ignore
            class C { public constructor(a: any) { } }
            @inject("c")
            // @ts-ignore
            class B { public constructor(c: C) { } }
            @inject("b", "c")
            // @ts-ignore
            class A { public constructor(b: B, c: C) { } }

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
            @inject("a")
            // @ts-ignore
            class D { public constructor(a: any) { } }
            @inject("d")
            // @ts-ignore
            class C { public constructor(d: D) { } }
            @inject("c")
            // @ts-ignore
            class B { public constructor(c: C) { } }
            @inject("b", "c")
            // @ts-ignore
            class A { public constructor(b: B, c: C) { } }

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
            class C { }
            @inject("c", "b")
            // @ts-ignore
            class B { public constructor(c: C, b: B) { } }
            @inject("b", "c")
            // @ts-ignore
            class A { public constructor(b: B, c: C) { } }

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
        class B { }
        @inject("b")
        // @ts-ignore
        class A { public constructor(b: B) { } }
        
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