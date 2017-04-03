import { BaseScope } from "./base-scope";
import { ComponentRegistry } from "./component-registry";
import { Scope } from "./scope";
export declare class ChildScope extends BaseScope {
    constructor(componentRegistry: ComponentRegistry, parentScope: Scope);
}
