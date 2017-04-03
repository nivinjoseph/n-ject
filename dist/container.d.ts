import { Scope } from "./scope";
import { BaseScope } from "./base-scope";
import { ComponentInstaller } from "./component-installer";
import { Registry } from "./registry";
export declare class Container extends BaseScope implements Registry {
    constructor();
    registerTransient(key: string, component: Function): Registry;
    registerScoped(key: string, component: Function): Registry;
    registerSingleton(key: string, component: Function): Registry;
    install(componentInstaller: ComponentInstaller): Container;
    createScope(): Scope;
    bootstrap(): void;
    private register(key, component, lifestyle);
}
