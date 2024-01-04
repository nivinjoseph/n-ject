import { given } from "@nivinjoseph/n-defensive";
import { ObjectDisposedException } from "@nivinjoseph/n-exception";
import { BaseScope } from "./base-scope.js";
import { ComponentRegistry } from "./component-registry.js";
import { Scope } from "./scope.js";
import { ScopeType } from "./scope-type.js";

// internal
export class ChildScope extends BaseScope
{
    public constructor(componentRegistry: ComponentRegistry, parentScope: Scope)
    {
        given(componentRegistry, "componentRegistry").ensureHasValue().ensureIsType(ComponentRegistry);
        given(parentScope, "parentScope").ensureHasValue().ensureIsObject();

        super(ScopeType.Child, componentRegistry, parentScope);
        
        this.bootstrap();
    }
    // cannot put this method in the base class due to circular reference issue
    public createScope(): Scope
    {
        if (this.isDisposed)
            throw new ObjectDisposedException(this);
        
        given(this, "this").ensure(t => t.isBootstrapped, "not bootstrapped");

        return new ChildScope(this.componentRegistry, this);
    }
}