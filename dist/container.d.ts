import Scope from "./scope";
import BaseScope from "./base-scope";
import Lifestyle from "./lifestyle";
import ComponentInstaller from "./component-installer";
import Registry from "./registry";
export default class Container extends BaseScope implements Registry {
    private _isBootstrapped;
    constructor();
    register(key: string, component: Function, lifestyle: Lifestyle): Container;
    install(componentInstaller: ComponentInstaller): Container;
    createScope(): Scope;
    bootstrap(): void;
}
