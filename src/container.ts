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
        return this.register(key, component, Lifestyle.Transient);
    }
    
    public registerScoped(key: string, component: Function): Registry
    {
        return this.register(key, component, Lifestyle.Scoped);
    }
    
    public registerSingleton(key: string, component: Function): Registry
    {
        return this.register(key, component, Lifestyle.Singleton);
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
    
    private register(key: string, component: Function, lifestyle: Lifestyle): Container
    {
        if (this.isBootstrapped)
            throw new InvalidOperationException("register after bootstrap");

        given(key, "key").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());
        given(component, "component").ensureHasValue().ensure(t => typeof t === "function");
        given(lifestyle, "lifestyle").ensureHasValue();

        this.componentRegistry.register(key, component, lifestyle);
        return this;
    }
}