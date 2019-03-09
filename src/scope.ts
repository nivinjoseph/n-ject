import { ScopeType } from "./scope-type";
import { ServiceLocator } from "./service-locator";

// public
export interface Scope extends ServiceLocator
{
    readonly id: string;
    readonly scopeType: ScopeType;
    createScope(): Scope;
}