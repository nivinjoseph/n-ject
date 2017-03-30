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
    
    suite.skip("Instance Checks", () =>
    {
        suite("Singleton", () =>
        {
            test("Given the singleton instance resolving the root, should succeed", () =>
            {
                class A { }

                cont.register("a", A, Lifestyle.Singleton);
                cont.bootstrap();
                cont.resolve("a");

                assert.ok(true);
            });

            test("Given the singleton instance resolving the child, should succeed", () =>
            {
                class A { }

                cont.register("a", A, Lifestyle.Singleton);
                cont.bootstrap();
                let child = cont.createScope();
                child.resolve("a");

                assert.ok(true);
            });

            test("Given the singleton instance create another scope should create the same instance", () =>
            {
                class A { }

                cont.register("a", A, Lifestyle.Singleton);
                cont.bootstrap();
                let child = cont.createScope();
                let child2 = cont.createScope();

                assert.strictEqual(cont.resolve("a"), child.resolve("a"));
            });
        });
        
        suite("Scoped", () =>
        {
            test("Given the scoped instance resolving the root, should fail", () =>
            {
                class A { }

                assert.throws(() =>
                {
                    cont.register("a", A, Lifestyle.Scoped);
                    cont.bootstrap();
                    cont.resolve("a");
                });
            });

            test("Given the scoped instance creating a different child, should succeed", () =>
            {
                class A { }

                cont.register("a", A, Lifestyle.Scoped);
                cont.bootstrap();
                let child = cont.createScope();
                child.resolve("a");

                assert.ok(true);
            });

            test("Should always return the same instance from same child, different from different child", () =>
            {
                class A { }

                cont.register("a", A, Lifestyle.Scoped);
                cont.bootstrap();

                let child = cont.createScope();
                let childInstance = child.resolve("a");
                let child2 = cont.createScope();
                let child2Instance = child2.resolve("a");

                assert.strictEqual(childInstance, cont.resolve("a"));
                assert.notStrictEqual(childInstance, child2Instance);

            });
        });
        
        suite("Transient", () =>
        {
            test("Given the transient instance resolving the root, should succeed", () =>
            {
                class A { }

                cont.register("a", A, Lifestyle.Transient);
                cont.bootstrap();
                cont.resolve("a");

                assert.ok(true);
            });

            test("Given the transient instance resolving the child, should succeed", () =>
            {
                class A { }

                cont.register("a", A, Lifestyle.Transient);
                cont.bootstrap();
                let child = cont.createScope();
                child.resolve("a");

                assert.ok(true);
            });

            test("Should always be a new instance when creating one or many newScope's", () =>
            {
                class A { }

                cont.register("a", A, Lifestyle.Transient);
                cont.bootstrap();
                let child = cont.createScope();
                let child2 = cont.createScope();

                assert.notStrictEqual(cont.resolve("a"), child.resolve("a"));
                assert.notStrictEqual(cont.resolve("a"), child2.resolve("a"));
                assert.notStrictEqual(child.resolve("a"), child2.resolve("a"));
            });
        });    
    });
});