import { given } from "@nivinjoseph/n-defensive";
import assert from "node:assert";
import { afterEach, beforeEach, describe, test } from "node:test";
import { ComponentInstaller, Container, Registry, inject } from "./../src/index.js";


await describe("Container", async () =>
{
    let cont: Container;

    beforeEach(() =>
    {
        cont = new Container();
    });

    afterEach(async () =>
    {
        await cont.dispose();
    });

    await describe("Installer check", async () =>
    {
        class A { }

        class TestInstaller implements ComponentInstaller
        {
            public install(registry: Registry): void
            {
                registry.registerTransient("a", A);
            }
        }
        await test("should resolve successfully when using the installer based registration", () =>
        {
            const inst = new TestInstaller();
            cont.install(inst);
            cont.bootstrap();
            const a = cont.resolve("a");

            assert.notStrictEqual(a, null);
        });
    });

    await describe("Bootstrap check", async () =>
    {
        class A { }

        await test("should throw exception when creating a child scope before bootstrapping", () =>
        {
            assert.throws(() =>
            {
                cont.createScope();
            });
        });

        await test("should throw exception when registering after bootstrapping", () => 
        {
            cont.bootstrap();

            assert.throws(() =>
            {
                cont.registerTransient("a", A);
            });
        });

        await test("should throw exception when installing installer after bootstrapping", () => 
        {
            class TestInstaller implements ComponentInstaller
            {
                public install(registry: Registry): void
                {
                    registry.registerTransient("a", A);
                }
            }

            const inst = new TestInstaller();
            cont.bootstrap();

            assert.throws(() =>
            {
                cont.install(inst);
            });
        });

        await test("should throw exception when resolving unregistered key", () => 
        {
            cont.bootstrap();

            assert.throws(() =>
            {
                cont.resolve("a");
            });
        });

        await test("should throw except when resolving before bootstrapping", () =>
        {
            cont.registerTransient("a", A);

            assert.throws(() =>
            {
                cont.resolve("a");
            });
        });
    });

    await describe("Resolution Rules", async () =>
    {
        class B { }

        @inject("b")
        class A
        {
            public constructor(b: B)
            {
                given(b, "b").ensureHasValue().ensureIsType(B);
            }
        }

        await describe("Singleton", async () =>
        {
            beforeEach(() =>
            {
                cont.registerSingleton("a", A);
            });

            // singleton -> singleton
            await describe("given singleton A to singleton B dependency, when resolving A", async () =>
            {
                beforeEach(() =>
                {
                    cont.registerSingleton("b", B);
                });

                await test("should resolve successfully from child scope", () =>
                {
                    cont.bootstrap();
                    const child = cont.createScope();
                    const a = child.resolve("a");

                    assert.notStrictEqual(a, null);
                });

                await test("should resolve successfully from root scope", () => 
                {
                    cont.bootstrap();
                    const a = cont.resolve("a");

                    assert.notStrictEqual(a, null);
                });
            });

            // singleton -> scoped
            await describe("given singleton A to scoped B dependency", async () =>
            {
                beforeEach(() =>
                {
                    cont.registerScoped("b", B);
                });

                await test("should throw exception when bootstraping", () =>
                {
                    assert.throws(() =>
                    {
                        cont.bootstrap();
                    });
                });
            });

            // singleton -> transient
            await describe("given singleton A to transient B dependency, when resolving A", async () =>
            {
                beforeEach(() =>
                {
                    cont.registerTransient("b", B);
                });

                await test("should resolve successfully from child scope", () =>
                {
                    cont.bootstrap();
                    const child = cont.createScope();
                    const a = child.resolve("a");

                    assert.notStrictEqual(a, null);
                });

                await test("should resolve successfully from root scope", () => 
                {
                    cont.bootstrap();
                    const a = cont.resolve("a");

                    assert.notStrictEqual(a, null);
                });
            });
        });

        await describe("Scoped", async () =>
        {
            beforeEach(() =>
            {
                cont.registerScoped("a", A);
            });

            // scoped -> singleton
            await describe("given scoped A to singleton B dependency, when resolving A", async () =>
            {
                beforeEach(() =>
                {
                    cont.registerSingleton("b", B);
                });

                await test("should resolve successfully from child scope", () =>
                {
                    cont.bootstrap();
                    const child = cont.createScope();
                    const a = child.resolve("a");

                    assert.notStrictEqual(a, null);
                });

                await test("should throw exception when resolving from root scope", () => 
                {
                    assert.throws(() =>
                    {
                        cont.bootstrap();
                        cont.resolve("a");
                    });
                });
            });

            // scoped -> scoped
            await describe("given scoped A to scoped B dependency, when resolving A", async () =>
            {
                beforeEach(() =>
                {
                    cont.registerScoped("b", B);
                });

                await test("should resolve successfully from child scope", () =>
                {
                    cont.bootstrap();
                    const child = cont.createScope();
                    const a = child.resolve("a");

                    assert.notStrictEqual(a, null);
                });

                await test("should throw exception when resolving from root scope", () => 
                {
                    assert.throws(() =>
                    {
                        cont.bootstrap();
                        cont.resolve("a");
                    });
                });
            });

            // scoped -> transient
            await describe("given scoped A to transient B dependency, when resolving A", async () =>
            {
                beforeEach(() =>
                {
                    cont.registerTransient("b", B);
                });

                await test("should resolve successfully from child scope", () =>
                {
                    cont.bootstrap();
                    const child = cont.createScope();
                    const a = child.resolve("a");

                    assert.notStrictEqual(a, null);
                });

                await test("should throw exception when resolving from root scope", () => 
                {
                    assert.throws(() =>
                    {
                        cont.bootstrap();
                        cont.resolve("a");
                    });
                });
            });
        });

        await describe("Transient", async () =>
        {
            beforeEach(() =>
            {
                cont.registerTransient("a", A);
            });

            // transient -> singleton
            await describe("given transient A to singleton B dependency, when resolving A", async () =>
            {
                beforeEach(() =>
                {
                    cont.registerSingleton("b", B);
                });

                await test("should resolve successfully from child scope", () =>
                {
                    cont.bootstrap();
                    const child = cont.createScope();
                    const a = child.resolve("a");

                    assert.notStrictEqual(a, null);
                });

                await test("should resolve successfully from root scope", () => 
                {
                    cont.bootstrap();
                    const a = cont.resolve("a");

                    assert.notStrictEqual(a, null);
                });
            });

            // transient -> scoped
            await describe("given transient A to scoped B dependency, when resolving A", async () =>
            {
                beforeEach(() =>
                {
                    cont.registerScoped("b", B);
                });

                await test("should resolve successfully from child scope", () =>
                {
                    cont.bootstrap();
                    const child = cont.createScope();
                    const a = child.resolve("a");

                    assert.notStrictEqual(a, null);
                });

                await test("should throw exception when resolving from root scope", () => 
                {
                    assert.throws(() =>
                    {
                        cont.bootstrap();
                        cont.resolve("a");
                    });
                });
            });

            // transient -> transient
            await describe("given transient A to transient B dependency, when resolving A", async () =>
            {
                beforeEach(() =>
                {
                    cont.registerTransient("b", B);
                });

                await test("should resolve successfully from child scope", () =>
                {
                    cont.bootstrap();
                    const child = cont.createScope();
                    const a = child.resolve("a");

                    assert.notStrictEqual(a, null);
                });

                await test("should resolve successfully from root scope", () => 
                {
                    cont.bootstrap();
                    const a = cont.resolve("a");

                    assert.notStrictEqual(a, null);
                });
            });
        });
    });

    await describe("Instance Check", async () =>
    {
        class A { }

        await describe("Given Singleton A", async () =>
        {
            beforeEach(() =>
            {
                cont.registerSingleton("a", A);
                cont.bootstrap();
            });

            await test("should resolve successfully from child scope", async  () =>
            {
                const child = cont.createScope();
                const a = child.resolve("a");

                assert.notStrictEqual(a, null);
            });

            await test("should resolve successfully from root scope", () =>
            {
                const a = cont.resolve("a");

                assert.notStrictEqual(a, null);
            });

            await test("should be the same instance when resolved from root scope or any child scope", () =>
            {
                const child = cont.createScope();

                assert.strictEqual(cont.resolve("a"), child.resolve("a"));
            });
        });

        await describe("Given Scoped A", async () =>
        {
            beforeEach(() =>
            {
                cont.registerScoped("a", A);
                cont.bootstrap();
            });

            await test("should resolve successfully from the child scope", () =>
            {
                const child = cont.createScope();
                const a = child.resolve("a");

                assert.notStrictEqual(a, null);
            });

            await test("should throw exception when resolving the root scope", () =>
            {
                assert.throws(() =>
                {
                    cont.resolve("a");
                });
            });

            await test("should always return the same instance from same child", () =>
            {
                const child = cont.createScope();

                assert.strictEqual(child.resolve("a"), child.resolve("a"));

            });

            await test("should always return different instances from different child", () =>
            {
                const child1 = cont.createScope();
                const child2 = cont.createScope();

                assert.notStrictEqual(child1.resolve("a"), child2.resolve("a"));
            });
        });

        await describe("Given Transient A", async () =>
        {
            beforeEach(() =>
            {
                cont.registerTransient("a", A);
                cont.bootstrap();
            });

            await test("should resolve successfully from the child scope", () =>
            {
                const child = cont.createScope();
                const a = child.resolve("a");

                assert.notStrictEqual(a, null);
            });

            await test("should resolve successfully from the root scope", () =>
            {
                const a = cont.resolve("a");

                assert.notStrictEqual(a, null);
            });

            await test("should be a new instance every time when resolved multiple times from root scope", () =>
            {
                assert.notStrictEqual(cont.resolve("a"), cont.resolve("a"));
            });

            await test("should be a new instance every time when resolved multiple times from child scope", () =>
            {
                const child = cont.createScope();

                assert.notStrictEqual(cont.resolve("a"), child.resolve("a"));
            });
        });
    });
});