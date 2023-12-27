import { given } from "@nivinjoseph/n-defensive";
import assert from "node:assert";
import { afterEach, beforeEach, describe, test } from "node:test";
import { ComponentRegistry } from "./../src/component-registry.js";
import { inject } from "./../src/index.js";
import { Lifestyle } from "./../src/lifestyle.js";

// registered dependant but not dependency

await describe("ComponentRegistry", async () =>
{
    let cr: ComponentRegistry;

    beforeEach(() =>
    {
        console.log("running hook before");
        cr = new ComponentRegistry();
    });

    afterEach(async () =>
    {
        await cr.dispose();
    });

    await describe("Registry Validation", async () =>
    {
        await test("Should throw exception when dependant A is registered but dependency B is not", () =>
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

            cr.register("a", A, Lifestyle.Transient);
            assert.throws(() =>
            {
                cr.verifyRegistrations();
            });
        });
    });

    await describe("Dependency graph", async () =>
    {
        await test("Given Tree verification, should succeed", () =>
        {
            class B { }

            class C { }

            @inject("b", "c")
            class A
            {
                public constructor(b: B, c: C)
                {
                    given(b, "b").ensureHasValue().ensureIsType(B);
                    given(c, "c").ensureHasValue().ensureIsType(C);
                }
            }

            cr.register("a", A, Lifestyle.Transient);
            cr.register("b", B, Lifestyle.Transient);
            cr.register("c", C, Lifestyle.Transient);
            cr.verifyRegistrations();

            assert.ok(true);
        });

        await test("Given DAG verification, should succeed", () =>
        {
            class C { }

            @inject("c")
            class B
            {
                public constructor(c: C)
                {
                    given(c, "c").ensureHasValue().ensureIsType(C);
                }
            }

            @inject("b", "c")
            class A
            {
                public constructor(b: B, c: C)
                {
                    given(b, "b").ensureHasValue().ensureIsType(B);
                    given(c, "c").ensureHasValue().ensureIsType(C);
                }
            }

            cr.register("a", A, Lifestyle.Transient);
            cr.register("b", B, Lifestyle.Transient);
            cr.register("c", C, Lifestyle.Transient);
            cr.verifyRegistrations();

            assert.ok(true);
        });

        await test("Given DCG verification, should fail", () =>
        {
            @inject("a")
            class C
            {
                public constructor(a: any)
                {
                    given(a, "a").ensureHasValue();
                }
            }

            @inject("c")
            class B
            {
                public constructor(c: C)
                {
                    given(c, "c").ensureHasValue().ensureIsType(C);
                }
            }

            @inject("b")
            class A
            {
                public constructor(b: B)
                {
                    given(b, "b").ensureHasValue().ensureIsType(B);
                }
            }

            assert.throws(() =>
            {
                cr.register("a", A, Lifestyle.Transient);
                cr.register("b", B, Lifestyle.Transient);
                cr.register("c", C, Lifestyle.Transient);
                cr.verifyRegistrations();
            });
        });

        await test("Given DCG (immediate cycle) verification, should fail", () =>
        {
            @inject("a")
            class C
            {
                public constructor(a: any)
                {
                    given(a, "a").ensureHasValue();
                }
            }

            @inject("c")
            class B
            {
                public constructor(c: C)
                {
                    given(c, "c").ensureHasValue().ensureIsType(C);
                }
            }

            @inject("b", "c")
            class A
            {
                public constructor(b: B, c: C)
                {
                    given(b, "b").ensureHasValue().ensureIsType(B);
                    given(c, "c").ensureHasValue().ensureIsType(C);
                }
            }

            assert.throws(() =>
            {
                cr.register("a", A, Lifestyle.Transient);
                cr.register("b", B, Lifestyle.Transient);
                cr.register("c", C, Lifestyle.Transient);
                cr.verifyRegistrations();
            });
        });

        await test("Given DCG (late cycle) verification, should fail", () =>
        {
            @inject("a")
            class D
            {
                public constructor(a: any)
                {
                    given(a, "a").ensureHasValue();
                }
            }

            @inject("d")
            class C
            {
                public constructor(d: D)
                {
                    given(d, "d").ensureHasValue().ensureIsType(D);
                }
            }

            @inject("c")
            class B
            {
                public constructor(c: C)
                {
                    given(c, "c").ensureHasValue().ensureIsType(C);
                }
            }

            @inject("b", "c")
            class A
            {
                public constructor(b: B, c: C)
                {
                    given(b, "b").ensureHasValue().ensureIsType(B);
                    given(c, "c").ensureHasValue().ensureIsType(C);
                }
            }

            assert.throws(() =>
            {
                cr.register("a", A, Lifestyle.Transient);
                cr.register("b", B, Lifestyle.Transient);
                cr.register("c", C, Lifestyle.Transient);
                cr.register("d", D, Lifestyle.Transient);
                cr.verifyRegistrations();
            });
        });

        await test("Given DCG (self cycle) verification, should fail", () =>
        {
            class C { }

            @inject("c", "b")
            class B
            {
                public constructor(c: C, b: B)
                {
                    given(c, "c").ensureHasValue().ensureIsType(C);
                    given(b, "b").ensureHasValue().ensureIsType(B);
                }
            }

            @inject("b", "c")
            class A
            {
                public constructor(b: B, c: C)
                {
                    given(b, "b").ensureHasValue().ensureIsType(B);
                    given(c, "c").ensureHasValue().ensureIsType(C);
                }
            }

            assert.throws(() =>
            {
                cr.register("a", A, Lifestyle.Transient);
                cr.register("b", B, Lifestyle.Transient);
                cr.register("c", C, Lifestyle.Transient);
                cr.verifyRegistrations();
            });
        });
    });

    await describe("Dependency Lifestyle", async () =>
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
                cr.register("a", A, Lifestyle.Singleton);
            });

            // Singleton -> Singleton
            await test("Given the singleton to singleton dependency, should succeed", () =>
            {
                cr.register("b", B, Lifestyle.Singleton);
                cr.verifyRegistrations();

                assert.ok(true);
            });

            // Singleton -> Scoped
            await test("Given the singleton to scoped dependency, should fail", () =>
            {
                cr.register("b", B, Lifestyle.Scoped);

                assert.throws(() =>
                {
                    cr.verifyRegistrations();
                });
            });

            // Singleton -> Transient
            await test("Given the singleton to transient dependency, should succeed", () =>
            {
                cr.register("b", B, Lifestyle.Transient);
                cr.verifyRegistrations();

                assert.ok(true);
            });
        });

        await describe("Scoped", async () =>
        {
            beforeEach(() =>
            {
                cr.register("a", A, Lifestyle.Scoped);
            });

            // Scoped -> Singleton
            await test("Given the scoped to singleton dependency, should succeed", () =>
            {
                cr.register("b", B, Lifestyle.Singleton);
                cr.verifyRegistrations();

                assert.ok(true);
            });

            // Scoped -> Scoped
            await test("Given the scoped to scoped dependency, should succeed", () =>
            {
                cr.register("b", B, Lifestyle.Scoped);
                cr.verifyRegistrations();

                assert.ok(true);
            });

            // Scoped -> Transient
            await test("Given the scoped to transient dependency, should succeed", () =>
            {
                cr.register("b", B, Lifestyle.Transient);
                cr.verifyRegistrations();

                assert.ok(true);
            });
        });

        await describe("Transient", async () =>
        {
            beforeEach(() =>
            {
                cr.register("a", A, Lifestyle.Transient);
            });

            // Transient -> Singleton
            await test("Given the transient to singleton dependency, should succeed", () =>
            {
                cr.register("b", B, Lifestyle.Singleton);
                cr.verifyRegistrations();

                assert.ok(true);
            });

            // Transient -> Scoped
            await test("Given the transient to scoped dependency, should succeed", () =>
            {
                cr.register("b", B, Lifestyle.Scoped);
                cr.verifyRegistrations();

                assert.ok(true);
            });

            // Transient -> Transient
            await test("Given the transient to transient dependency, should succeed", () =>
            {
                cr.register("b", B, Lifestyle.Transient);
                cr.verifyRegistrations();

                assert.ok(true);
            });
        });
    });
});