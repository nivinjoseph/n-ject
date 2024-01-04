import { given } from "@nivinjoseph/n-defensive";
import { ObjectDisposedException } from "@nivinjoseph/n-exception";
import { BaseScope } from "./base-scope.js";
import { ComponentRegistry } from "./component-registry.js";
import { ScopeType } from "./scope-type.js";
// internal
export class ChildScope extends BaseScope {
    constructor(componentRegistry, parentScope) {
        given(componentRegistry, "componentRegistry").ensureHasValue().ensureIsType(ComponentRegistry);
        given(parentScope, "parentScope").ensureHasValue().ensureIsObject();
        super(ScopeType.Child, componentRegistry, parentScope);
        this.bootstrap();
    }
    // cannot put this method in the base class due to circular reference issue
    createScope() {
        if (this.isDisposed)
            throw new ObjectDisposedException(this);
        given(this, "this").ensure(t => t.isBootstrapped, "not bootstrapped");
        return new ChildScope(this.componentRegistry, this);
    }
}
//# sourceMappingURL=child-scope.js.map