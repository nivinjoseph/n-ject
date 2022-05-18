import { ScopeType } from "./scope-type";
import { ServiceLocator } from "./service-locator";
import { Disposable } from "@nivinjoseph/n-util";
export interface Scope extends ServiceLocator, Disposable {
    readonly scopeType: ScopeType;
    createScope(): Scope;
}
