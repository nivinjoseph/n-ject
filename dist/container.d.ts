import { Scope } from "./scope";
import { BaseScope } from "./base-scope";
import { ComponentInstaller } from "./component-installer";
import { Registry } from "./registry";
export declare class Container extends BaseScope implements Registry {
    constructor();
    registerTransient(key: string, component: Function, ...aliases: string[]): Registry;
    registerScoped(key: string, component: Function, ...aliases: string[]): Registry;
    registerSingleton(key: string, component: Function, ...aliases: string[]): Registry;
    registerInstance(key: string, instance: any, ...aliases: string[]): Registry;
    install(componentInstaller: ComponentInstaller): Container;
    createScope(): Scope;
    bootstrap(): void;
    dispose(): Promise<void>;
    deregister(key: string): void;
    private register;
}
