import BaseScope from "./base-scope";
import ComponentRegistry from "./component-registry";
import Scope from "./scope";
export default class ChildScope extends BaseScope {
    constructor(componentRegistry: ComponentRegistry, parentScope: Scope);
}
