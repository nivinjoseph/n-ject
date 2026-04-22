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

            assert.ok(a instanceof A);
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

                    assert.ok(a instanceof A);
                });

                await test("should resolve successfully from root scope", () => 
                {
                    cont.bootstrap();
                    const a = cont.resolve("a");

                    assert.ok(a instanceof A);
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

                    assert.ok(a instanceof A);
                });

                await test("should resolve successfully from root scope", () => 
                {
                    cont.bootstrap();
                    const a = cont.resolve("a");

                    assert.ok(a instanceof A);
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

                    assert.ok(a instanceof A);
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

                    assert.ok(a instanceof A);
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

                    assert.ok(a instanceof A);
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

                    assert.ok(a instanceof A);
                });

                await test("should resolve successfully from root scope", () => 
                {
                    cont.bootstrap();
                    const a = cont.resolve("a");

                    assert.ok(a instanceof A);
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

                    assert.ok(a instanceof A);
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

                    assert.ok(a instanceof A);
                });

                await test("should resolve successfully from root scope", () => 
                {
                    cont.bootstrap();
                    const a = cont.resolve("a");

                    assert.ok(a instanceof A);
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

                assert.ok(a instanceof A);
            });

            await test("should resolve successfully from root scope", () =>
            {
                const a = cont.resolve("a");

                assert.ok(a instanceof A);
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

                assert.ok(a instanceof A);
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

                assert.ok(a instanceof A);
            });

            await test("should resolve successfully from the root scope", () =>
            {
                const a = cont.resolve("a");

                assert.ok(a instanceof A);
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

    await describe("Reserved key and alias validation", async () =>
    {
        class A { }

        await test("should throw when registering with the reserved key", () =>
        {
            assert.throws(() => cont.registerTransient("ServiceLocator", A));
        });

        await test("should throw when registering with a case-variant of the reserved key", () =>
        {
            assert.throws(() => cont.registerTransient("servicelocator", A));
            assert.throws(() => cont.registerTransient("SERVICELOCATOR", A));
            assert.throws(() => cont.registerTransient("  ServiceLocator  ", A));
        });

        await test("should throw when an alias matches a reserved key (any case)", () =>
        {
            assert.throws(() => cont.registerTransient("a", A, "ServiceLocator"));
            assert.throws(() => cont.registerTransient("a", A, "servicelocator"));
        });

        await test("should throw when registering with an empty or whitespace key", () =>
        {
            assert.throws(() => cont.registerTransient("", A));
            assert.throws(() => cont.registerTransient("   ", A));
        });

        await test("should throw when an alias is empty or whitespace", () =>
        {
            assert.throws(() => cont.registerTransient("a", A, ""));
            assert.throws(() => cont.registerTransient("a", A, "   "));
        });

        await test("should throw when an alias equals the key after trimming", () =>
        {
            assert.throws(() => cont.registerTransient("a", A, " a "));
        });
    });

    await describe("Error messages", async () =>
    {
        await test("createScope before bootstrap should throw with an accurate message", () =>
        {
            assert.throws(() => cont.createScope(), /createScope before bootstrap/);
        });

        await test("deregister after bootstrap should throw with an accurate message", () =>
        {
            class A { }
            cont.registerTransient("a", A);
            cont.bootstrap();

            assert.throws(() => cont.deregister("a"), /deregister after bootstrap/);
        });
    });

    await describe("Dispose with aliases", async () =>
    {
        await test("should call dispose exactly once on a scoped instance registered with aliases", async () =>
        {
            let disposeCount = 0;

            class A
            {
                public dispose(): Promise<void>
                {
                    disposeCount++;
                    return Promise.resolve();
                }
            }

            cont.registerScoped("a", A, "alias1", "alias2");
            cont.bootstrap();

            const child = cont.createScope();
            child.resolve("a");

            await child.dispose();

            assert.strictEqual(disposeCount, 1);
        });

        await test("should call dispose exactly once on a singleton registered with aliases", async () =>
        {
            let disposeCount = 0;

            class A
            {
                public dispose(): Promise<void>
                {
                    disposeCount++;
                    return Promise.resolve();
                }
            }

            cont.registerSingleton("a", A, "alias1", "alias2");
            cont.bootstrap();

            cont.resolve("a");

            await cont.dispose();

            assert.strictEqual(disposeCount, 1);
        });
    });

    await describe("registerInstance", async () =>
    {
        await test("should resolve the exact same instance from root and child scopes", () =>
        {
            const config = { env: "test" };
            cont.registerInstance("config", config);
            cont.bootstrap();

            const child = cont.createScope();

            assert.strictEqual(cont.resolve("config"), config);
            assert.strictEqual(child.resolve("config"), config);
        });

        await test("should throw when registering a null or undefined instance", () =>
        {
            assert.throws(() => cont.registerInstance("x", null as unknown as object));
            assert.throws(() => cont.registerInstance("x", undefined as unknown as object));
        });

        await test("should dispose a disposable instance when the container disposes", async () =>
        {
            let disposed = false;
            const instance = {
                dispose(): Promise<void>
                {
                    disposed = true;
                    return Promise.resolve();
                }
            };

            cont.registerInstance("x", instance);
            cont.bootstrap();
            cont.resolve("x");

            await cont.dispose();

            assert.strictEqual(disposed, true);
        });

        await test("should resolve via alias", () =>
        {
            const config = { env: "test" };
            cont.registerInstance("config", config, "settings");
            cont.bootstrap();

            assert.strictEqual(cont.resolve("settings"), config);
        });
    });

    await describe("deregister", async () =>
    {
        class A { }

        await test("should remove a registration so resolve throws after bootstrap", () =>
        {
            cont.registerTransient("a", A);
            cont.deregister("a");
            cont.bootstrap();

            assert.throws(() => cont.resolve("a"));
        });

        await test("should also remove aliases", () =>
        {
            cont.registerTransient("a", A, "alias1");
            cont.deregister("a");
            cont.bootstrap();

            assert.throws(() => cont.resolve("alias1"));
        });

        await test("should be a no-op when key is not registered", () =>
        {
            cont.deregister("does-not-exist");
            cont.bootstrap();
            assert.ok(true);
        });

        await test("should throw after bootstrap", () =>
        {
            cont.registerTransient("a", A);
            cont.bootstrap();

            assert.throws(() => cont.deregister("a"));
        });
    });

    await describe("Alias resolution", async () =>
    {
        class A { }

        await test("should resolve the same instance via key and alias for a singleton", () =>
        {
            cont.registerSingleton("a", A, "alias1", "alias2");
            cont.bootstrap();

            const viaKey = cont.resolve("a");
            const viaAlias1 = cont.resolve("alias1");
            const viaAlias2 = cont.resolve("alias2");

            assert.ok(viaKey instanceof A);
            assert.strictEqual(viaKey, viaAlias1);
            assert.strictEqual(viaKey, viaAlias2);
        });

        await test("should resolve the same scoped instance via key and alias within the same scope", () =>
        {
            cont.registerScoped("a", A, "alias1");
            cont.bootstrap();

            const child = cont.createScope();

            assert.strictEqual(child.resolve("a"), child.resolve("alias1"));
        });

        await test("should resolve a transient as distinct instances whether via key or alias", () =>
        {
            cont.registerTransient("a", A, "alias1");
            cont.bootstrap();

            assert.notStrictEqual(cont.resolve("a"), cont.resolve("alias1"));
        });
    });

    await describe("ServiceLocator injection", async () =>
    {
        class B { }

        @inject("ServiceLocator")
        class A
        {
            public readonly locator: { resolve<T extends object>(key: string): T; };

            public constructor(locator: { resolve<T extends object>(key: string): T; })
            {
                given(locator, "locator").ensureHasValue().ensureIsObject();
                this.locator = locator;
            }
        }

        await test("should inject the resolving scope when a dependency is ServiceLocator", () =>
        {
            cont.registerScoped("a", A);
            cont.registerTransient("b", B);
            cont.bootstrap();

            const child = cont.createScope();
            const a = child.resolve<A>("a");

            assert.ok(a.locator.resolve("b") instanceof B);
        });

        await test("should allow resolving ServiceLocator directly from a scope", () =>
        {
            cont.bootstrap();
            const child = cont.createScope();

            assert.strictEqual(child.resolve("ServiceLocator"), child);
        });
    });

    await describe("Multi-level child scopes", async () =>
    {
        class A { }

        await test("should create a grandchild scope from a child scope", () =>
        {
            cont.registerTransient("a", A);
            cont.bootstrap();

            const child = cont.createScope();
            const grandchild = child.createScope();

            assert.ok(grandchild.resolve("a") instanceof A);
        });

        await test("should give each scope its own scoped instance", () =>
        {
            cont.registerScoped("a", A);
            cont.bootstrap();

            const child = cont.createScope();
            const grandchild = child.createScope();

            assert.notStrictEqual(child.resolve("a"), grandchild.resolve("a"));
        });

        await test("should share a singleton across parent, child, and grandchild scopes", () =>
        {
            cont.registerSingleton("a", A);
            cont.bootstrap();

            const child = cont.createScope();
            const grandchild = child.createScope();

            assert.strictEqual(cont.resolve("a"), child.resolve("a"));
            assert.strictEqual(child.resolve("a"), grandchild.resolve("a"));
        });
    });
});