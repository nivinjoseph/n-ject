import { BaseScope } from "./base-scope";
import { given } from "n-defensive";
import { ScopeType } from "./scope-type";
import { ComponentRegistry } from "./component-registry";
import { Scope } from "./scope";
import { InvalidOperationException } from "n-exception";

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
    
    public createScope(): Scope
    {
        if (!this.isBootstrapped)
            throw new InvalidOperationException("createScope after bootstrap");

        return new ChildScope(this.componentRegistry, this);
    }
}