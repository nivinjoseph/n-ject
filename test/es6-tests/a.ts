import { given } from "@nivinjoseph/n-defensive";
import { inject } from "./../../src/inject";
import { B } from "./b";
import { C } from "./c";

@inject("B", "C")
export class A
{
    public constructor(b: B, c: C)
    {
        given(b, "b").ensureHasValue().ensureIsType(B);
        given(c, "c").ensureHasValue().ensureIsType(C);
    }
}