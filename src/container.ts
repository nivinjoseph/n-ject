import given from "n-defensive";
import Scope from "./scope";
import ScopeType from "./scope-type";
import Lifestyle from "./lifestyle";
import "n-ext";
import { ApplicationException } from "n-exception";

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
    
    private findInstance(registration: Registration): object
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
    
    private findScopedInstance(registration: Registration): object
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

    private createInstance(registration: Registration): object
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

export default class Container extends BaseScope
{
    public constructor()
    {
        super(ScopeType.Root, new ComponentRegistry(), null);
    }


    public register(key: string, component: Function, lifestyle: Lifestyle): Container
    {
        this.componentRegistry.register(key, component, lifestyle);
        return this;
    }

    public createScope(): Scope
    {
        return new ChildScope(this.componentRegistry, this);
    }

    public bootstrap(): void
    {
        this.componentRegistry.verifyRegistrations();
    }
}

class ChildScope extends BaseScope
{
    public constructor(componentRegistry: ComponentRegistry, parentScope: Scope)
    {
        given(componentRegistry, "componentRegistry").ensureHasValue();
        given(parentScope, "parentScope").ensureHasValue();
        
        super(ScopeType.Child, componentRegistry, parentScope);
    }
}    

class ComponentRegistry
{
    private readonly _registrations = new Array<Registration>();
    private readonly _registry = {};


    public register(key: string, component: Function, lifestyle: Lifestyle): void
    {
        given(key, "key").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());
        given(component, "component").ensureHasValue().ensure(t => typeof t === "function");
        given(lifestyle, "lifestyle").ensureHasValue();

        key = key.trim();
        if (this._registry[key])
            throw new ApplicationException("Duplicate registration for key '{0}'".format(key));

        let registration = new Registration(key, component, lifestyle);
        this._registrations.push(registration);
        this._registry[key] = registration;
    }

    public verifyRegistrations(): void
    {
        for (let registration of this._registrations)
            this.walkDependencyGraph(registration);
    }

    public find(key: string): Registration
    {
        given(key, "key").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());

        key = key.trim();
        return this._registry[key];
    }


    private walkDependencyGraph(registration: Registration, visited: object = {}): void
    {
        // check if current is in visited
        // add current to visited
        // check if the dependencies are registered
        // walk the dependencies reusing the visited
        // remove current from visited

        if (visited[registration.key])
            throw new ApplicationException("Circular dependency detected with registration '{0}'.".format(registration.key));

        visited[registration.key] = registration;

        for (let dependency of registration.dependencies)
        {
            if (!this._registry[dependency])
                throw new ApplicationException("Unregistered dependency '{0}' detected.".format(dependency));

            this.walkDependencyGraph(this._registry[dependency], visited);
        }

        visited[registration.key] = null;
    }
}

class Registration
{
    private readonly _key: string;
    private readonly _component: Function;
    private readonly _lifestyle: Lifestyle;
    private readonly _dependencies: Array<string>;


    public get key(): string { return this._key; }
    public get component(): Function { return this._component; }
    public get lifestyle(): Lifestyle { return this._lifestyle; }
    public get dependencies(): Array<string> { return this._dependencies; }


    public constructor(key: string, component: Function, lifestyle: Lifestyle)
    {
        this._key = key;
        this._component = component;
        this._lifestyle = lifestyle;
        this._dependencies = this.detectDependencies();
    }


    // Borrowed from AngularJS implementation
    private detectDependencies(): Array<string>
    {
        const FN_ARG_SPLIT = /,/;
        const FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;

        let dependencies = new Array<string>();

        let argDecl = this.extractArgs(this._component);
        argDecl[1].split(FN_ARG_SPLIT).forEach(arg =>
        {
            arg.replace(FN_ARG, (all, underscore, name) =>
            {
                dependencies.push(name);
                return undefined;
            });
        });

        return dependencies;
    }

    private stringifyFn(fn): string
    {
        return Function.prototype.toString.call(fn);
    }

    private extractArgs(fn): RegExpMatchArray
    {
        const ARROW_ARG = /^([^(]+?)=>/;
        const FN_ARGS = /^[^(]*\(\s*([^)]*)\)/m;
        const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

        let fnText = this.stringifyFn(fn).replace(STRIP_COMMENTS, "");
        let args = fnText.match(ARROW_ARG) || fnText.match(FN_ARGS);
        return args;
    }
}