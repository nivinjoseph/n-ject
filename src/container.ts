import { given } from "n-defensive";
import { Scope } from "./scope";
import { BaseScope } from "./base-scope";
import { ComponentRegistry } from "./component-registry";
import { ScopeType } from "./scope-type";
import { Lifestyle } from "./lifestyle";
import { ChildScope } from "./child-scope";
import { ComponentInstaller } from "./component-installer";
import { Registry } from "./registry";
import { InvalidOperationException } from "n-exception";

// public
export class Container extends BaseScope implements Registry
{
    public constructor()
    {
        super(ScopeType.Root, new ComponentRegistry(), null);
    }

    public registerTransient(key: string, component: Function): Registry
    {
        this.register(key, component, Lifestyle.Transient);
        return this;
    }
    
    public registerScoped(key: string, component: Function): Registry
    {
        this.register(key, component, Lifestyle.Scoped);
        return this;
    }
    
    public registerSingleton(key: string, component: Function): Registry
    {
        this.register(key, component, Lifestyle.Singleton);
        return this;
    }
    
    public registerInstance(key: string, instance: any): Registry
    {
        this.register(key, instance, Lifestyle.Instance);
        return this;
    }
    
    public install(componentInstaller: ComponentInstaller): Container
    {
        if (this.isBootstrapped)
            throw new InvalidOperationException("install after bootstrap");    
        
        given(componentInstaller, "componentInstaller").ensureHasValue();
        componentInstaller.install(this);
        return this;
    }

    public createScope(): Scope
    {
        if (!this.isBootstrapped)
            throw new InvalidOperationException("createScope after bootstrap");
        
        return new ChildScope(this.componentRegistry, this);
    }

    public bootstrap(): void
    {
        if (this.isBootstrapped)
            throw new InvalidOperationException("bootstrap after bootstrap");

        this.componentRegistry.verifyRegistrations();
        
        super.bootstrap();
    }
    
    private register(key: string, component: Function, lifestyle: Lifestyle): void
    {
        if (this.isBootstrapped)
            throw new InvalidOperationException("register after bootstrap");

        given(key, "key").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());
        given(component, "component").ensureHasValue();
        given(lifestyle, "lifestyle").ensureHasValue();

        this.componentRegistry.register(key, component, lifestyle);
    }
}