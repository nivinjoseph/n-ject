import { BaseScope } from "./base-scope.js";
import { ComponentInstaller } from "./component-installer.js";
import { Registry } from "./registry.js";
import { Scope } from "./scope.js";
export declare class Container extends BaseScope implements Registry {
    private _myDisposePromise;
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
//# sourceMappingURL=container.d.ts.map