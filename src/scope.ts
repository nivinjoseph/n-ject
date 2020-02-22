import { ScopeType } from "./scope-type";
import { ServiceLocator } from "./service-locator";
import { Disposable } from "./disposable";

// public
export interface Scope extends ServiceLocator, Disposable
{
    // readonly id: string;
    readonly scopeType: ScopeType;
    createScope(): Scope;
}