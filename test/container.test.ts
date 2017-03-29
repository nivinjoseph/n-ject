import * as assert from "assert";
import { Container, Lifestyle } from "./../src/index";

suite("Container", () =>
{
    suite("Lifestyle Dependency", () =>
    {
        // test("", () => {
            // class Root { public constructor(child: Child) { } }
            // class Child { }

            // let cr = new Container();
            // cr.register("root", Root, Lifestyle.Scoped);
            // cr.register("child", Child, Lifestyle.Scoped);
            // cr.bootstrap();
            // assert.ok(true);

            // cr.resolve<A>("a");
            // cr.resolve<B>("b");
        // });
        
        test("Given that the root is a singleton should succeed", () =>
        {
            class Root { public constructor(child: Child) { } }
            class Child { }

            let cr = new Container();
            cr.register("root", Root, Lifestyle.Singleton);
            cr.register("child", Child, Lifestyle.Singleton);
            cr.bootstrap();
            assert.ok(true);

            cr.resolve<Root>("a");
            cr.resolve<Child>("b");
        });
        
        test("Given that the child is a singleton should succeed", () =>
        {
            class Root { public constructor(child: Child) { } }
            class Child { }

            let cr = new Container();
            cr.register("root", Root, Lifestyle.Singleton);
            cr.register("child", Child, Lifestyle.Singleton);
            cr.bootstrap();
            assert.ok(true);

            cr.resolve<Root>("a");
            cr.resolve<Child>("b");
        });
        
        test("Given that the root is a scoped should succeed", () =>
        {
            class Root { public constructor(child: Child) { } }
            class Child { }

            let cr = new Container();
            cr.register("root", Root, Lifestyle.Singleton);
            cr.register("child", Child, Lifestyle.Singleton);
            cr.bootstrap();
            assert.ok(true);

            cr.resolve<Root>("a");
            cr.resolve<Child>("b");
        });

        test("Given that the child is a scoped should succeed", () =>
        {

        });
        
        test("Given that the root is a transient should succeed", () =>
        {

        });

        test("Given that the child is a transient should succeed", () =>
        {

        });
    });
});