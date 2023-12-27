import { Disposable } from "@nivinjoseph/n-util";
import { ScopeType } from "./scope-type.js";
import { ServiceLocator } from "./service-locator.js";

// public
export interface Scope extends ServiceLocator, Disposable
{
    // readonly id: string;
    readonly scopeType: ScopeType;
    createScope(): Scope;
}