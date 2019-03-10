import { given } from "@nivinjoseph/n-defensive";
import { Scope } from "./scope";
import { ScopeType } from "./scope-type";
import { Lifestyle } from "./lifestyle";
import "@nivinjoseph/n-ext";
import { ApplicationException, InvalidOperationException, ObjectDisposedException } from "@nivinjoseph/n-exception";
import { ComponentRegistry } from "./component-registry";
import { ComponentRegistration } from "./component-registration";
import { Uuid, Disposable } from "@nivinjoseph/n-util";
import { ReservedKeys } from "./reserved-keys";

// internal
export abstract class BaseScope implements Scope
{
    private readonly _id: string;
    private readonly _scopeType: ScopeType;
    private readonly _componentRegistry: ComponentRegistry;
    private readonly _parentScope: Scope;
    private readonly _scopedInstanceRegistry: {[index: string]: object} = {};
    private _isBootstrapped = false;
    private _isDisposed = false;

    
    public get id(): string { return this._id; }
    public get scopeType(): ScopeType { return this._scopeType; }
    
    protected get componentRegistry(): ComponentRegistry { return this._componentRegistry; }
    protected get isBootstrapped(): boolean { return this._isBootstrapped; }
    protected get isDisposed(): boolean { return this._isDisposed; }
    


    protected constructor(scopeType: ScopeType, componentRegistry: ComponentRegistry, parentScope: Scope)
    {
        given(scopeType, "scopeType").ensureHasValue();
        given(componentRegistry, "componentRegistry").ensureHasValue();
        given(parentScope, "parentScope")
            // @ts-ignore
            .ensure(t => scopeType === ScopeType.Child ? parentScope != null : parentScope == null,
            "cannot be null if scope is a child scope and has to be null if scope is root scope");

        this._id = Uuid.create();
        this._scopeType = scopeType;
        this._componentRegistry = componentRegistry;
        this._parentScope = parentScope;
    }


    public resolve<T extends object>(key: string): T
    {
        if (this._isDisposed)
            throw new ObjectDisposedException(this);
        
        if (!this.isBootstrapped)
            throw new InvalidOperationException("resolve");    
        
        given(key, "key").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());

        key = key.trim();
        if (key === ReservedKeys.serviceLocator)
            return this as unknown as T;
        
        let registration = this._componentRegistry.find(key);
        if (!registration)
            throw new ApplicationException("No component with key '{0}' registered.".format(key));

        return this.findInstance(registration) as T;
    }
    
    public async dispose(): Promise<void>
    {
        if (this._isDisposed)
            return;
        
        this._isDisposed = true;
        
        let disposables;
        
        try 
        {
            disposables = Object.keys(this._scopedInstanceRegistry)
                .map(t => this._scopedInstanceRegistry[t])
                .filter(t => !!(<Disposable>t).dispose)
                .map(t => ({ type: (<Object>t).getTypeName(), promise: (<Disposable>t).dispose() }));
        }
        catch (error)
        {
            console.error(`Error: Failed to dispose one or more scoped components.`);
            console.error(error);
            return;
        }
        
        for (const disposable of disposables)
        {
            try 
            {
                await disposable.promise;
            }
            catch (error)
            {
                console.error(`Error: Failed to dispose component of type '${disposable.type}'.`);
                console.error(error);
            }
        }
    }
    
    public abstract createScope(): Scope;
    
    
    protected bootstrap(): void
    {
        this._isBootstrapped = true;
    }

    private findInstance(registration: ComponentRegistration): object
    {
        if (registration.lifestyle === Lifestyle.Instance)
        {
            return registration.component; 
        }    
        else if (registration.lifestyle === Lifestyle.Singleton)
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
            const instance = this.createInstance(registration);
            this._scopedInstanceRegistry[registration.key] = instance;
            registration.aliases.forEach(t => this._scopedInstanceRegistry[t] = instance);
            return instance;
        }
    }

    private createInstance(registration: ComponentRegistration): object
    {
        const dependencyInstances = [];
        for (const dependency of registration.dependencies)
        {        
            if (dependency === ReservedKeys.serviceLocator)
            {
                dependencyInstances.push(this);
                continue;
            }
            
            const dependencyRegistration = this._componentRegistry.find(dependency);
            if (!dependencyRegistration)
                throw new ApplicationException("Dependency '{0}' of component '{1}' not registered."
                    .format(dependency, registration.key));

            dependencyInstances.push(this.findInstance(dependencyRegistration));
        }
        return new (<any>registration.component)(...dependencyInstances);
    }
}