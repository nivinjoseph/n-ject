import { given } from "@nivinjoseph/n-defensive";
import { InvalidOperationException, ObjectDisposedException } from "@nivinjoseph/n-exception";
import { BaseScope } from "./base-scope.js";
import { ChildScope } from "./child-scope.js";
import { ComponentInstaller } from "./component-installer.js";
import { ComponentRegistry } from "./component-registry.js";
import { Lifestyle } from "./lifestyle.js";
import { Registry } from "./registry.js";
import { ReservedKeys } from "./reserved-keys.js";
import { Scope } from "./scope.js";
import { ScopeType } from "./scope-type.js";

// public
export class Container extends BaseScope implements Registry
{    
    private _myDisposePromise: Promise<void> | null = null;
    
    public constructor()
    {
        super(ScopeType.Root, new ComponentRegistry(), null);
    }

    public registerTransient(key: string, component: Function, ...aliases: Array<string>): Registry
    {
        this._register(key, component, Lifestyle.Transient, ...aliases);
        return this;
    }
    
    public registerScoped(key: string, component: Function, ...aliases: Array<string>): Registry
    {
        this._register(key, component, Lifestyle.Scoped, ...aliases);
        return this;
    }
    
    public registerSingleton(key: string, component: Function, ...aliases: Array<string>): Registry
    {
        this._register(key, component, Lifestyle.Singleton, ...aliases);
        return this;
    }
    
    public registerInstance(key: string, instance: object, ...aliases: Array<string>): Registry
    {
        this._register(key, instance, Lifestyle.Instance, ...aliases);
        return this;
    }
    
    public install(componentInstaller: ComponentInstaller): Container
    {
        if (this.isDisposed)
            throw new ObjectDisposedException(this);
        
        if (this.isBootstrapped)
            throw new InvalidOperationException("install after bootstrap");    
        
        given(componentInstaller, "componentInstaller").ensureHasValue();
        componentInstaller.install(this);
        return this;
    }

    public createScope(): Scope
    {
        if (this.isDisposed)
            throw new ObjectDisposedException(this);
        
        if (!this.isBootstrapped)
            throw new InvalidOperationException("createScope after bootstrap");
        
        return new ChildScope(this.componentRegistry, this);
    }

    public override bootstrap(): void
    {
        if (this.isDisposed)
            throw new ObjectDisposedException(this);
        
        if (this.isBootstrapped)
            throw new InvalidOperationException("bootstrap after bootstrap");

        this.componentRegistry.verifyRegistrations();
        
        super.bootstrap();
    }
    
    public override dispose(): Promise<void>
    {
        if (this._myDisposePromise == null)
            this._myDisposePromise = super.dispose().then(() => this.componentRegistry.dispose());
        
        return this._myDisposePromise;
    }
    
    public deregister(key: string): void
    {
        if (this.isDisposed)
            throw new ObjectDisposedException(this);

        if (this.isBootstrapped)
            throw new InvalidOperationException("register after bootstrap");

        given(key, "key").ensureHasValue();
        
        this.componentRegistry.deregister(key);
    }
    
    private _register(key: string, component: Function | object, lifestyle: Lifestyle, ...aliases: Array<string>): void
    {
        if (this.isDisposed)
            throw new ObjectDisposedException(this);
        
        if (this.isBootstrapped)
            throw new InvalidOperationException("register after bootstrap");

        given(key, "key").ensureHasValue().ensureIsString()
            .ensure(t => !ReservedKeys.all.contains(t.trim()), "cannot use reserved key");
        given(component, "component").ensureHasValue();
        given(lifestyle, "lifestyle").ensureHasValue().ensureIsNumber();
        given(aliases, "aliases").ensureHasValue().ensureIsArray()
            .ensure(t => t.every(u => u !== key), "alias cannot be the same as key")
            .ensure(t => t.length === t.distinct().length, "duplicates detected");

        this.componentRegistry.register(key, component, lifestyle, ...aliases);
    }
}