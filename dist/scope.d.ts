import { ScopeType } from "./scope-type";
import { ServiceLocator } from "./service-locator";
import { Disposable } from "./disposable";
export interface Scope extends ServiceLocator, Disposable {
    readonly scopeType: ScopeType;
    createScope(): Scope;
}
