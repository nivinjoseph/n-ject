import { given } from "@nivinjoseph/n-defensive";
import { Scope } from "./scope";
import { BaseScope } from "./base-scope";
import { ComponentRegistry } from "./component-registry";
import { ScopeType } from "./scope-type";
import { Lifestyle } from "./lifestyle";
import { ChildScope } from "./child-scope";
import { ComponentInstaller } from "./component-installer";
import { Registry } from "./registry";
import { InvalidOperationException, ObjectDisposedException } from "@nivinjoseph/n-exception";
import { ReservedKeys } from "./reserved-keys";

// public
export class Container extends BaseScope implements Registry
{    
    public constructor()
    {
        super(ScopeType.Root, new ComponentRegistry(), null);
    }

    public registerTransient(key: string, component: Function, ...aliases: string[]): Registry
    {
        this.register(key, component, Lifestyle.Transient, ...aliases);
        return this;
    }
    
    public registerScoped(key: string, component: Function, ...aliases: string[]): Registry
    {
        this.register(key, component, Lifestyle.Scoped, ...aliases);
        return this;
    }
    
    public registerSingleton(key: string, component: Function, ...aliases: string[]): Registry
    {
        this.register(key, component, Lifestyle.Singleton, ...aliases);
        return this;
    }
    
    public registerInstance(key: string, instance: any, ...aliases: string[]): Registry
    {
        this.register(key, instance, Lifestyle.Instance, ...aliases);
        return this;
    }
    
    public install(componentInstaller: ComponentInstaller): Container
    {
        if (this.isDisposed)
            throw new ObjectDisposedException(this);
        
        // if (this.isBootstrapped)
        //     throw new InvalidOperationException("install after bootstrap");    
        
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
        
        // if (this.isBootstrapped)
        //     throw new InvalidOperationException("bootstrap after bootstrap");

        this.componentRegistry.verifyRegistrations();
        
        super.bootstrap();
    }
    
    public override async dispose(): Promise<void>
    {
        if (this.isDisposed)
            return;
        
        await super.dispose();
        
        await this.componentRegistry.dispose();
    }
    
    private register(key: string, component: Function, lifestyle: Lifestyle, ...aliases: string[]): void
    {
        if (this.isDisposed)
            throw new ObjectDisposedException(this);
        
        // if (this.isBootstrapped)
        //     throw new InvalidOperationException("register after bootstrap");

        given(key, "key").ensureHasValue()
            .ensure(t => !ReservedKeys.all.contains(t.trim()), "cannot use reserved key");
        given(component, "component").ensureHasValue();
        given(lifestyle, "lifestyle").ensureHasValue().ensureIsNumber();
        given(aliases, "aliases").ensureHasValue().ensureIsArray()
            .ensure(t => t.every(u => u !== key), "alias cannot be the same as key")
            .ensure(t => t.length === t.distinct().length, "duplicates detected");

        this.componentRegistry.register(key, component, lifestyle, ...aliases);
    }
}