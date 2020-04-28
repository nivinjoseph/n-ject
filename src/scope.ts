import { ScopeType } from "./scope-type";
import { ServiceLocator } from "./service-locator";
import { Disposable } from "@nivinjoseph/n-util";

// public
export interface Scope extends ServiceLocator, Disposable
{
    // readonly id: string;
    readonly scopeType: ScopeType;
    createScope(): Scope;
}