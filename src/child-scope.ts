import { BaseScope } from "./base-scope";
import { given } from "@nivinjoseph/n-defensive";
import { ScopeType } from "./scope-type";
import { ComponentRegistry } from "./component-registry";
import { Scope } from "./scope";
import { InvalidOperationException, ObjectDisposedException } from "@nivinjoseph/n-exception";

// internal
export class ChildScope extends BaseScope
{
    public constructor(componentRegistry: ComponentRegistry, parentScope: Scope)
    {
        given(componentRegistry, "componentRegistry").ensureHasValue();
        given(parentScope, "parentScope").ensureHasValue();

        super(ScopeType.Child, componentRegistry, parentScope);
        
        this.bootstrap();
    }
    // cannot put this method in the base class due to circular reference issue
    public createScope(): Scope
    {
        if (this.isDisposed)
            throw new ObjectDisposedException(this);
        
        if (!this.isBootstrapped)
            throw new InvalidOperationException("createScope after bootstrap");

        return new ChildScope(this.componentRegistry, this);
    }
}