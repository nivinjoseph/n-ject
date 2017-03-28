import given from "n-defensive";
import Scope from "./scope";
import BaseScope from "./base-scope";
import ComponentRegistry from "./component-registry";
import ScopeType from "./scope-type";
import Lifestyle from "./lifestyle";
import ChildScope from "./child-scope";
import ComponentInstaller from "./component-installer";
import Registry from "./registry";

// public
export default class Container extends BaseScope implements Registry
{
    public constructor()
    {
        super(ScopeType.Root, new ComponentRegistry(), null);
    }


    public register(key: string, component: Function, lifestyle: Lifestyle): Container
    {
        given(key, "key").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());
        given(component, "component").ensureHasValue().ensure(t => typeof t === "function");
        given(lifestyle, "lifestyle").ensureHasValue();
        
        this.componentRegistry.register(key, component, lifestyle);
        return this;
    }
    
    public install(componentInstaller: ComponentInstaller): Container
    {
        given(componentInstaller, "componentInstaller").ensureHasValue();
        componentInstaller.install(this);
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