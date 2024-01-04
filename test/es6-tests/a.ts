import { given } from "@nivinjoseph/n-defensive";
import { inject } from "./../../src/index.js";
import { B } from "./b.js";
import { C } from "./c.js";

@inject("B", "C")
export class A
{
    public constructor(b: B, c: C)
    {
        given(b, "b").ensureHasValue().ensureIsType(B);
        given(c, "c").ensureHasValue().ensureIsType(C);
    }
}