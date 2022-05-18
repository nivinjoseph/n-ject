import { BaseScope } from "./base-scope";
import { given } from "@nivinjoseph/n-defensive";
import { ScopeType } from "./scope-type";
import { ComponentRegistry } from "./component-registry";
import { Scope } from "./scope";
import { ObjectDisposedException } from "@nivinjoseph/n-exception";

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