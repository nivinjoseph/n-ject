import * as assert from "assert";
import { Container, Lifestyle } from "./../src/index";

suite("Container", () =>
{
    let cont: Container;

    setup(() =>
    {
        cont = new Container();
    });
    
    suite("Resolution Rules", () =>
    {   
        class A { public constructor(b: B) { } }
        class B { }
        
        suite("Singleton", () =>
        {
            setup(() =>
            {
                cont.register("a", A, Lifestyle.Singleton);
            });
            
            // singleton -> singleton
            suite("given singleton A to singleton B dependency, when resolving A", () =>
            {
                setup(() =>
                {
                    cont.register("b", B, Lifestyle.Singleton);
                });

                test("should resolve successfully from child scope", () =>
                {
                    cont.bootstrap();
                    let child = cont.createScope();
                    let a = child.resolve("a");

                    assert.notStrictEqual(a, null);
                });

                test("should resolve successfully from root scope", () => 
                {
                    cont.bootstrap();
                    let a = cont.resolve("a");

                    assert.notStrictEqual(a, null);
                });
            });

            // singleton -> scoped
            suite("given singleton A to scoped B dependency", () =>
            {
                setup(() =>
                {
                    cont.register("b", B, Lifestyle.Scoped);
                });

                test("should throw exception when bootstraping", () =>
                {
                    assert.throws(() =>
                    {
                        cont.bootstrap();
                    });
                });
            });

            // singleton -> transient
            suite("given singleton A to transient B dependency, when resolving A", () =>
            {
                setup(() =>
                {
                    cont.register("b", B, Lifestyle.Transient);
                });

                test("should resolve successfully from child scope", () =>
                {
                    cont.bootstrap();
                    let child = cont.createScope();
                    let a = child.resolve("a");

                    assert.notStrictEqual(a, null);
                });

                test("should resolve successfully from root scope", () => 
                {
                    cont.bootstrap();
                    let a = cont.resolve("a");

                    assert.notStrictEqual(a, null);
                });
            });
        });
        
        suite("Scoped", () =>
        {
            setup(() =>
            {
                cont.register("a", A, Lifestyle.Scoped);
            });
            
            // scoped -> singleton
            suite("given scoped A to singleton B dependency, when resolving A", () =>
            {
                setup(() =>
                {
                    cont.register("b", B, Lifestyle.Singleton);
                });

                test("should resolve successfully from child scope", () =>
                {
                    cont.bootstrap();
                    let child = cont.createScope();
                    let a = child.resolve("a");

                    assert.notStrictEqual(a, null);
                });

                test("should throw exception when resolving from root scope", () => 
                {
                    assert.throws(() =>
                    {
                        cont.bootstrap();
                        cont.resolve("a");
                    });
                });
            });

            // scoped -> scoped
            suite("given scoped A to scoped B dependency, when resolving A", () =>
            {
                setup(() =>
                {
                    cont.register("b", B, Lifestyle.Scoped);
                });

                test("should resolve successfully from child scope", () =>
                {
                    cont.bootstrap();
                    let child = cont.createScope();
                    let a = child.resolve("a");

                    assert.notStrictEqual(a, null);
                });

                test("should throw exception when resolving from root scope", () => 
                {
                    assert.throws(() =>
                    {
                        cont.bootstrap();
                        cont.resolve("a");
                    });
                });
            });

            // scoped -> transient
            suite("given scoped A to transient B dependency, when resolving A", () =>
            {
                setup(() =>
                {
                    cont.register("b", B, Lifestyle.Transient);
                });

                test("should resolve successfully from child scope", () =>
                {
                    cont.bootstrap();
                    let child = cont.createScope();
                    let a = child.resolve("a");

                    assert.notStrictEqual(a, null);
                });

                test("should throw exception when resolving from root scope", () => 
                {
                    assert.throws(() =>
                    {
                        cont.bootstrap();
                        cont.resolve("a");
                    });
                });
            });
        });
        
        suite("Transient", () =>
        {
            setup(() =>
            {
                cont.register("a", A, Lifestyle.Transient);
            });
            
            // transient -> singleton
            suite("given transient A to singleton B dependency, when resolving A", () =>
            {
                setup(() =>
                {
                    cont.register("b", B, Lifestyle.Singleton);
                });

                test("should resolve successfully from child scope", () =>
                {
                    cont.bootstrap();
                    let child = cont.createScope();
                    let a = child.resolve("a");

                    assert.notStrictEqual(a, null);
                });

                test("should resolve successfully from root scope", () => 
                {
                    cont.bootstrap();
                    let a = cont.resolve("a");
                    
                    assert.notStrictEqual(a, null);
                });
            });

            // transient -> scoped
            suite("given transient A to scoped B dependency, when resolving A", () =>
            {
                setup(() =>
                {
                    cont.register("b", B, Lifestyle.Scoped);
                });

                test("should resolve successfully from child scope", () =>
                {
                    cont.bootstrap();
                    let child = cont.createScope();
                    let a = child.resolve("a");

                    assert.notStrictEqual(a, null);
                });

                test("should throw exception when resolving from root scope", () => 
                {
                    assert.throws(() =>
                    {
                        cont.bootstrap();
                        cont.resolve("a");
                    });
                });
            });

            // transient -> transient
            suite("given transient A to transient B dependency, when resolving A", () =>
            {
                setup(() =>
                {
                    cont.register("b", B, Lifestyle.Transient);
                });

                test("should resolve successfully from child scope", () =>
                {
                    cont.bootstrap();
                    let child = cont.createScope();
                    let a = child.resolve("a");

                    assert.notStrictEqual(a, null);
                });

                test("should resolve successfully from root scope", () => 
                {
                    cont.bootstrap();
                    let a = cont.resolve("a");
                    
                    assert.notStrictEqual(a, null);
                });
            });
        });
    });
    
    suite("Instance Check", () =>
    {
        class A { }
        
        suite("Given Singleton A", () =>
        {
            setup(() =>
            {
                cont.register("a", A, Lifestyle.Singleton);
                cont.bootstrap();
            });
            
            test("should resolve successfully from child scope", () =>
            {
                let child = cont.createScope();
                let a = child.resolve("a");

                assert.notStrictEqual(a, null);
            });
            
            test("should resolve successfully from root scope", () =>
            {
                let a = cont.resolve("a");

                assert.notStrictEqual(a, null);
            });

            test("should be the same instance when resolved from root scope or any child scope", () =>
            {
                let child = cont.createScope();

                assert.strictEqual(cont.resolve("a"), child.resolve("a"));
            });
        });
        
        suite("Given Scoped A", () =>
        {
            setup(() =>
            {
                cont.register("a", A, Lifestyle.Scoped);
                cont.bootstrap();
            });   

            test("should resolve successfully from the child scope", () =>
            {
                let child = cont.createScope();
                let a = child.resolve("a");

                assert.notStrictEqual(a, null);
            });
            
            test("should throw exception when resolving the root scope", () =>
            {
                assert.throws(() =>
                {
                    cont.resolve("a");
                });
            });

            test("should always return the same instance from same child", () =>
            {
                let child = cont.createScope();

                assert.strictEqual(child.resolve("a"), child.resolve("a"));
                
            });
            
            test("should always return different instances from different child", () =>
            {
                let child1 = cont.createScope();
                let child2 = cont.createScope();
                
                assert.notStrictEqual(child1.resolve("a"), child2.resolve("a"));
            });
        });
        
        suite("Given Transient A", () =>
        {
            setup(() =>
            {
                cont.register("a", A, Lifestyle.Transient);
                cont.bootstrap();
            });
            
            test("should resolve successfully from the child scope", () =>
            {
                let child = cont.createScope();
                let a = child.resolve("a");

                assert.notStrictEqual(a, null);
            });
            
            test("should resolve successfully from the root scope", () =>
            {
                let a = cont.resolve("a");

                assert.notStrictEqual(a, null);
            });
            
            test("should be a new instance everytime when resolved multiple times from root scope", () =>
            {
                assert.notStrictEqual(cont.resolve("a"), cont.resolve("a"));
            });

            test("should be a new instance everytime when resolved multiple times from child scope", () =>
            {
                let child = cont.createScope();

                assert.notStrictEqual(cont.resolve("a"), child.resolve("a"));
            });
        });    
    });
});