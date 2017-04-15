import { inject } from "./../../src/inject";
import { B } from "./b";
import { C } from "./c";

@inject("B", "C")
export class A { public constructor(b: B, c: C) { } }