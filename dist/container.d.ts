import { Scope } from "./scope";
import { BaseScope } from "./base-scope";
import { ComponentInstaller } from "./component-installer";
import { Registry } from "./registry";
export declare class Container extends BaseScope implements Registry {
    constructor();
    registerTransient(key: string, component: Function, ...aliases: Array<string>): Registry;
    registerScoped(key: string, component: Function, ...aliases: Array<string>): Registry;
    registerSingleton(key: string, component: Function, ...aliases: Array<string>): Registry;
    registerInstance(key: string, instance: object, ...aliases: Array<string>): Registry;
    install(componentInstaller: ComponentInstaller): Container;
    createScope(): Scope;
    bootstrap(): void;
    dispose(): Promise<void>;
    deregister(key: string): void;
    private _register;
}
