import given from "n-defensive";
import Scope from "./scope";
import BaseScope from "./base-scope";
import ComponentRegistry from "./component-registry";
import ScopeType from "./scope-type";
import Lifestyle from "./lifestyle";
import ChildScope from "./child-scope";
import ComponentInstaller from "./component-installer";
import Registry from "./registry";
import { InvalidOperationException } from "n-exception";

// public
export default class Container extends BaseScope implements Registry
{
    private _isBootstrapped = false;
    
    
    public constructor()
    {
        super(ScopeType.Root, new ComponentRegistry(), null);
    }


    public register(key: string, component: Function, lifestyle: Lifestyle): Container
    {
        if (this._isBootstrapped)
            throw new InvalidOperationException("register");    
        
        given(key, "key").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());
        given(component, "component").ensureHasValue().ensure(t => typeof t === "function");
        given(lifestyle, "lifestyle").ensureHasValue();
        
        this.componentRegistry.register(key, component, lifestyle);
        return this;
    }
    
    public install(componentInstaller: ComponentInstaller): Container
    {
        if (this._isBootstrapped)
            throw new InvalidOperationException("install");    
        
        given(componentInstaller, "componentInstaller").ensureHasValue();
        componentInstaller.install(this);
        return this;
    }

    public createScope(): Scope
    {
        if (!this._isBootstrapped)
            throw new InvalidOperationException("createScope");
        
        return new ChildScope(this.componentRegistry, this);
    }

    public bootstrap(): void
    {
        if (this._isBootstrapped)
            throw new InvalidOperationException("bootstrap");
        
        this.componentRegistry.verifyRegistrations();
        this._isBootstrapped = true;
    }
}