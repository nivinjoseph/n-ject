import { Disposable } from "@nivinjoseph/n-util";
import { ScopeType } from "./scope-type.js";
import { ServiceLocator } from "./service-locator.js";
export interface Scope extends ServiceLocator, Disposable {
    readonly scopeType: ScopeType;
    createScope(): Scope;
}
//# sourceMappingURL=scope.d.ts.map