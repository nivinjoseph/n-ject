import * as assert from "assert";
import ComponentRegistry from "./../src/component-registry";
import { Container, Lifestyle } from "./../src/index";

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
    
    suite("Lifestyle Registry Dependency", () =>
    {
        suite("Singleton", () =>
        {
            // Singleton -> Singleton
            test("Given the singleton to singleton dependency registration should pass", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                let cr = new Container();
                cr.register("a", A, Lifestyle.Singleton);
                cr.register("b", B, Lifestyle.Singleton);
                cr.bootstrap();
                assert.ok(true);
            });
            
            // Singleton -> Singleton - root
            test("Given the singleton to singleton dependency resolving the root should pass", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                let cr = new Container();
                cr.register("a", A, Lifestyle.Singleton);
                cr.register("b", B, Lifestyle.Singleton);
                cr.bootstrap();
                cr.resolve("a");
                assert.ok(true);
            });
            
            // Singleton -> Singleton - child
            test("Given the singleton to singleton dependency resolving the child should pass", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                let cr = new Container();
                cr.register("a", A, Lifestyle.Singleton);
                cr.register("b", B, Lifestyle.Singleton);
                cr.bootstrap();
                let child = cr.createScope();
                cr.resolve("a");
                assert.ok(true);
            });
            
            // Singleton -> Scoped
            test("Given the singleton to scoped dependency registration should fail", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }
                
                assert.throws(() =>
                {
                    let cr = new ComponentRegistry();
                    cr.register("a", A, Lifestyle.Singleton);
                    cr.register("b", B, Lifestyle.Scoped);
                    cr.verifyRegistrations();
                });
            });
            
            // Singleton -> Scoped - root
            test("Given the singleton to scoped dependency resolving the root should fail", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }
                
                assert.throws(() =>
                {
                    let cr = new Container();
                    cr.register("a", A, Lifestyle.Singleton);
                    cr.register("b", B, Lifestyle.Scoped);
                    cr.bootstrap();
                    cr.resolve("a");
                    assert.ok(true);
                });
            });
            
            // Singleton -> Scoped - child
            // test("Given the singleton to scoped dependency resolving the root should fail", () =>
            // {
            //     class A { public constructor(b: B) { } }
            //     class B { }
                
            //     let cr = new Container();
            //     cr.register("a", A, Lifestyle.Singleton);
            //     cr.register("b", B, Lifestyle.Scoped);
            //     cr.bootstrap();
            //     cr.createScope();
            //     assert.ok(true);
            // });
            
            // Singleton -> Transient
            test("Given the singleton to transient dependency registration should pass", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                let cr = new ComponentRegistry();
                cr.register("a", A, Lifestyle.Singleton);
                cr.register("b", B, Lifestyle.Transient);
                cr.verifyRegistrations();
                assert.ok(true);
            });
            
            // Singleton -> Transient - root
            test("Given the singleton to transient dependency resolving the root should pass", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                let cr = new Container();
                cr.register("a", A, Lifestyle.Singleton);
                cr.register("b", B, Lifestyle.Transient);
                cr.bootstrap();
                cr.resolve("a");
                assert.ok(true);
            });
            
            // Singleton -> Transient - child
            test("Given the singleton to transient dependency resolving the child should pass", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                let cr = new Container();
                cr.register("a", A, Lifestyle.Singleton);
                cr.register("b", B, Lifestyle.Transient);
                cr.bootstrap();
                cr.createScope();
                assert.ok(true);
            });
        });
        
        suite("Scoped", () =>
        {   
            // Scoped -> Singleton
            test("Given the scoped to singleton dependency registration should pass", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                let cr = new ComponentRegistry();
                cr.register("a", A, Lifestyle.Scoped);
                cr.register("b", B, Lifestyle.Singleton);
                cr.verifyRegistrations();
                assert.ok(true);
            });
            
            // Scoped -> Singleton - root
            test("Given the scoped to singleton dependency resolving the root should fail", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }
                
                assert.throws(() =>
                {
                    let cr = new Container();
                    cr.register("a", A, Lifestyle.Scoped);
                    cr.register("b", B, Lifestyle.Singleton);
                    cr.bootstrap();
                    cr.resolve("a");
                });    
            });
            
            // Scoped -> Singleton - child
            test("Given the scoped to singleton dependency resolving the child should pass", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                let cr = new Container();
                cr.register("a", A, Lifestyle.Scoped);
                cr.register("b", B, Lifestyle.Singleton);
                cr.bootstrap();
                let child = cr.createScope();
                child.resolve("a");
                assert.ok(true);
            });
            
            // Scoped -> Scoped
            test("Given the scoped to scoped dependency registration should pass", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                let cr = new ComponentRegistry();
                cr.register("a", A, Lifestyle.Scoped);
                cr.register("b", B, Lifestyle.Scoped);
                cr.verifyRegistrations();
                assert.ok(true);
            });
            
            // Scoped -> Scoped - root
            test("Given the scoped to scoped dependency resolving the root should fail", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                assert.throws(() =>
                {
                    let cr = new Container();
                    cr.register("a", A, Lifestyle.Scoped);
                    cr.register("b", B, Lifestyle.Scoped);
                    cr.bootstrap();
                    cr.resolve("a");
                });  
            });
            
            // Scoped -> Scoped - child
            test("Given the scoped to singleton dependency resolving the child should pass", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                let cr = new Container();
                cr.register("a", A, Lifestyle.Scoped);
                cr.register("b", B, Lifestyle.Scoped);
                cr.bootstrap();
                let child = cr.createScope();
                child.resolve("a");
                assert.ok(true);
            });
            
            // Scoped -> Transient
            test("Given the scoped to transient dependency registration should pass", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                let cr = new ComponentRegistry();
                cr.register("a", A, Lifestyle.Scoped);
                cr.register("b", B, Lifestyle.Transient);
                cr.verifyRegistrations();
                assert.ok(true);
            });
            
            // Scoped -> Transient - root
            test("Given the scoped to transient dependency resolving the root should fail", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                assert.throws(() =>
                {
                    let cr = new Container();
                    cr.register("a", A, Lifestyle.Scoped);
                    cr.register("b", B, Lifestyle.Transient);
                    cr.bootstrap();
                    cr.resolve("a");
                }); 
            });
            
            // Scoped -> Transient - child
            test("Given the scoped to singleton dependency resolving the child should pass", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                let cr = new Container();
                cr.register("a", A, Lifestyle.Scoped);
                cr.register("b", B, Lifestyle.Transient);
                cr.bootstrap();
                let child = cr.createScope();
                child.resolve("a");
                assert.ok(true);
            });
        });
        
        suite("Transient", () =>
        {
            // Transient -> Singleton
            test("Given the transient to singleton dependency registration should pass", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                let cr = new ComponentRegistry();
                cr.register("a", A, Lifestyle.Transient);
                cr.register("b", B, Lifestyle.Singleton);
                cr.verifyRegistrations();
                assert.ok(true);
            });
            
            // Transient -> Singleton - root
            test("Given the transient to singleton dependency resolving the root should pass", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                let cr = new Container();
                cr.register("a", A, Lifestyle.Transient);
                cr.register("b", B, Lifestyle.Singleton);
                cr.bootstrap();
                cr.resolve("a");
                assert.ok(true);
            });
            
            // Transient -> Singleton - child
            test("Given the transient to singleton dependency resolving the child should pass", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                let cr = new Container();
                cr.register("a", A, Lifestyle.Transient);
                cr.register("b", B, Lifestyle.Singleton);
                cr.bootstrap();
                let child = cr.createScope();
                child.resolve("a");
                assert.ok(true);
            });
            
            // Transient -> Scoped
            test("Given the transient to scoped dependency registration should pass", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                let cr = new ComponentRegistry();
                cr.register("a", A, Lifestyle.Transient);
                cr.register("b", B, Lifestyle.Scoped);
                cr.verifyRegistrations();
                assert.ok(true);
            });
            
            // Transient -> Scoped - root
            test("Given the transient to scoped dependency resolving the root should fail", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                assert.throws(() =>
                {
                    let cr = new Container();
                    cr.register("a", A, Lifestyle.Transient);
                    cr.register("b", B, Lifestyle.Scoped);
                    cr.bootstrap();
                    cr.resolve("a");
                }); 
            });
            
            // Transient -> Scoped - child
            test("Given the transient to scoped dependency resolving the child should pass", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                let cr = new Container();
                cr.register("a", A, Lifestyle.Transient);
                cr.register("b", B, Lifestyle.Scoped);
                cr.bootstrap();
                let child = cr.createScope();
                child.resolve("a");
                assert.ok(true);
            });
            
            // Transient -> Transient
            test("Given the transient to transient dependency registration should pass", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                let cr = new ComponentRegistry();
                cr.register("a", A, Lifestyle.Transient);
                cr.register("b", B, Lifestyle.Transient);
                cr.verifyRegistrations();
                assert.ok(true);
            });
            
            // Transient -> Transient - root
            test("Given the transient to transient dependency resolving the root should pass", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                let cr = new Container();
                cr.register("a", A, Lifestyle.Transient);
                cr.register("b", B, Lifestyle.Transient);
                cr.bootstrap();
                cr.resolve("a");
                assert.ok(true);
            });
            
            // Transient -> Transient - child
            test("Given the transient to transient dependency resolving the child should pass", () =>
            {
                class A { public constructor(b: B) { } }
                class B { }

                let cr = new Container();
                cr.register("a", A, Lifestyle.Transient);
                cr.register("b", B, Lifestyle.Transient);
                cr.bootstrap();
                let child = cr.createScope();
                child.resolve("a");
                assert.ok(true);
            });
        });
    });
});