import { BaseScope } from "./base-scope.js";
import { ComponentRegistry } from "./component-registry.js";
import { Scope } from "./scope.js";
export declare class ChildScope extends BaseScope {
    constructor(componentRegistry: ComponentRegistry, parentScope: Scope);
    createScope(): Scope;
}
//# sourceMappingURL=child-scope.d.ts.map