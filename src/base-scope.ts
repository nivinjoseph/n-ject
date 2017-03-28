import given from "n-defensive";
import Scope from "./scope";
import ScopeType from "./scope-type";
import Lifestyle from "./lifestyle";
import "n-ext";
import { ApplicationException } from "n-exception";
import ComponentRegistry from "./component-registry";
import ComponentRegistration from "./component-registration";

// internal
abstract class BaseScope implements Scope
{
    private readonly _scopeType: ScopeType;
    private readonly _componentRegistry;
    private readonly _parentScope: Scope;
    private readonly _scopedInstanceRegistry = {};


    public get scopeType(): ScopeType { return this._scopeType; }
    protected get componentRegistry(): ComponentRegistry { return this._componentRegistry; }


    protected constructor(scopeType: ScopeType, componentRegistry: ComponentRegistry, parentScope: Scope)
    {
        given(scopeType, "scopeType").ensureHasValue();
        given(componentRegistry, "componentRegistry").ensureHasValue();
        given(parentScope, "parentScope")
            .ensure(t => scopeType === ScopeType.Child ? parentScope != null : parentScope == null,
            "cannot be null if scope is a child scope and has to be null if scope is root scope");

        this._scopeType = scopeType;
        this._componentRegistry = componentRegistry;
        this._parentScope = parentScope;
    }


    public resolve<T extends object>(key: string): T
    {
        given(key, "key").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());

        key = key.trim();
        let registration = this._componentRegistry.find(key);
        if (!registration)
            throw new ApplicationException("No component with key '{0}' registered.".format(key));

        return this.findInstance(registration) as T;
    }

    private findInstance(registration: ComponentRegistration): object
    {
        if (registration.lifestyle === Lifestyle.Singleton)
        {
            if (this.scopeType === ScopeType.Child)
                return this._parentScope.resolve(registration.key);
            else
                return this.findScopedInstance(registration);
        }
        else if (registration.lifestyle === Lifestyle.Scoped)
        {
            if (this.scopeType === ScopeType.Root)
                throw new ApplicationException("Cannot resolve component '{0}' with scoped lifestyle from root scope."
                    .format(registration.key));
            else
                return this.findScopedInstance(registration);
        }
        else
        {
            return this.createInstance(registration);
        }
    }

    private findScopedInstance(registration: ComponentRegistration): object
    {
        if (this._scopedInstanceRegistry[registration.key])
            return this._scopedInstanceRegistry[registration.key];
        else
        {
            let instance = this.createInstance(registration);
            this._scopedInstanceRegistry[registration.key] = instance;
            return instance;
        }
    }

    private createInstance(registration: ComponentRegistration): object
    {
        let dependencyInstances = [];
        for (let dependency of registration.dependencies)
        {
            let dependencyRegistration = this._componentRegistry.find(dependency);
            if (!dependencyRegistration)
                throw new ApplicationException("Dependency '{0}' of component '{1}' not registered."
                    .format(dependency, registration.key));

            dependencyInstances.push(this.findInstance(dependencyRegistration));
        }
        return new (<any>registration.component)(...dependencyInstances);
    }
}

export default BaseScope;