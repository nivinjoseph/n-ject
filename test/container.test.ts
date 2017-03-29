import * as assert from "assert";
import { Container, Lifestyle } from "./../src/index";

suite("Container", () =>
{
    suite("Lifestyle Dependency", () =>
    {      
        suite("Singleton", () =>
        {
            test("Given the singleton instance resolving the root should succeed", () =>
            {
                class A { }

                let cr = new Container();
                cr.register("a", A, Lifestyle.Singleton);
                cr.bootstrap();
                cr.resolve("a");

                assert.ok(true);
            });

            test("Given the singleton instance resolving the child should succeed", () =>
            {
                class A { }

                let cr = new Container();
                cr.register("a", A, Lifestyle.Singleton);
                cr.bootstrap();
                let child = cr.createScope();
                child.resolve("a");
                
                assert.ok(true);
            });

            test("Given the singleton instance create another scope should create the same instance", () =>
            {
                class A { }

                let cr = new Container();
                cr.register("a", A, Lifestyle.Singleton);
                cr.bootstrap();
                let child = cr.createScope();
                let child2 = cr.createScope();
                
                assert.strictEqual(cr.resolve("a"), child.resolve("a"));
            });
        });
        
        suite("Scoped", () =>
        {
            test("Given the scoped instance resolving the root should fail", () =>
            {
                class A { }

                assert.throws(() =>
                {
                    let cr = new Container();
                    cr.register("a", A, Lifestyle.Scoped);
                    cr.bootstrap();
                    cr.resolve("a");
                });
            });

            test("Given the scoped instance creating a different child will return", () =>
            {
                class A { }

                let cr = new Container();
                cr.register("a", A, Lifestyle.Scoped);
                cr.bootstrap();
                let child = cr.createScope();
                child.resolve("a");
                
                assert.ok(true);
            });
            
            test("Should always return the same instance from same child, different from different child", () =>
            {
                class A { }

                let cr = new Container();
                cr.register("a", A, Lifestyle.Scoped);
                cr.bootstrap();
                let child = cr.createScope();
                let childInstance = child.resolve("a");
                let child2 = cr.createScope();
                let child2Instance = child2.resolve("a");
                assert.strictEqual(childInstance, child2Instance);
            });
        });
        
        suite("Transient", () =>
        {
            test("Given the transient instance resolving the root should succeed", () =>
            {
                class A { }

                let cr = new Container();
                cr.register("a", A, Lifestyle.Transient);
                cr.bootstrap();
                cr.resolve("a");

                assert.ok(true);
            });

            test("Given the transient instance resolving the child should succeed", () =>
            {
                class A { }

                let cr = new Container();
                cr.register("a", A, Lifestyle.Transient);
                cr.bootstrap();
                let child = cr.createScope();
                child.resolve("a");
                
                assert.ok(true);
            });
            
            test("Should always be a new instance when creating one or many newScope's", () =>
            {
                class A { }
                let cr = new Container();
                cr.register("a", A, Lifestyle.Transient);
                cr.bootstrap();
                let child = cr.createScope();
                let child2 = cr.createScope();
                
                assert.notStrictEqual(cr.resolve("a"), child.resolve("a"));
                assert.notStrictEqual(cr.resolve("a"), child2.resolve("a"));
                assert.notStrictEqual(child.resolve("a"), child2.resolve("a"));
            });
        });
        
    });
});