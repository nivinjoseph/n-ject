import * as assert from "assert";
import Container from "../src/container";
import Lifestyle from "../src/lifestyle";

suite("Container", () =>
{
    suite("Dependency tests", () =>
    {
        test("Tree should booststrap just fine", () =>
        {
            class A { public constructor(b: B, c: C) { } }
            class B { }
            class C { }
            
            let container = new Container();
            container
                .register("a", A, Lifestyle.Transient)
                .register("b", B, Lifestyle.Transient)
                .register("c", C, Lifestyle.Transient)
                .bootstrap();
            
            assert.ok(true);
        }); 
        
        test("DAG should bootstrap just fine", () =>
        {
            class A { public constructor(b: B, c: C) { } }
            class B { public constructor(c: C) { } }
            class C { }
            
            let container = new Container();
            container
                .register("a", A, Lifestyle.Transient)
                .register("b", B, Lifestyle.Transient)
                .register("c", C, Lifestyle.Transient)
                .bootstrap();
            
            assert.ok(true);
        });
        
        test("DCG should throw an Exception", () =>
        {
            class A { public constructor(b: B) { } }
            class B { public constructor(c: C) { } }
            class C { public constructor(a: A) { } }
            
            assert.throws(() =>
            {
                let container = new Container();
                container
                    .register("a", A, Lifestyle.Transient)
                    .register("b", B, Lifestyle.Transient)
                    .register("c", C, Lifestyle.Transient)
                    .bootstrap();
            });
        });
        
        test("DCG (immediate) should throw an Exception", () =>
        {
            class A { public constructor(b: B, c: C) { } }
            class B { public constructor(c: C) { } }
            class C { public constructor(a: A) { } }
            
            assert.throws(() =>
            {
                let container = new Container();
                container
                    .register("a", A, Lifestyle.Transient)
                    .register("b", B, Lifestyle.Transient)
                    .register("c", C, Lifestyle.Transient)
                    .bootstrap();
            });
        });
        
        test("DCG (late) should throw an Exception", () =>
        {
            class A { public constructor(b: B, c: C) { } }
            class B { public constructor(c: C) { } }
            class C { public constructor(d: D) { } }
            class D { public constructor(a: A) { } }
            
            assert.throws(() =>
            {
                let container = new Container();
                container
                    .register("a", A, Lifestyle.Transient)
                    .register("b", B, Lifestyle.Transient)
                    .register("c", C, Lifestyle.Transient)
                    .register("d", D, Lifestyle.Transient)
                    .bootstrap();
            });
        });
        
        test("DCG (self) should throw an Exception", () =>
        {
            class A { public constructor(b: B, c: C) { } }
            class B { public constructor(c: C, b: B) { } }
            class C { }
            
            assert.throws(() =>
            {
                let container = new Container();
                container
                    .register("a", A, Lifestyle.Transient)
                    .register("b", B, Lifestyle.Transient)
                    .register("c", C, Lifestyle.Transient)
                    .bootstrap();
            });
        });
    });
});