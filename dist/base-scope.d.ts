import Scope from "./scope";
import ScopeType from "./scope-type";
import "n-ext";
import ComponentRegistry from "./component-registry";
declare abstract class BaseScope implements Scope {
    private readonly _scopeType;
    private readonly _componentRegistry;
    private readonly _parentScope;
    private readonly _scopedInstanceRegistry;
    readonly scopeType: ScopeType;
    protected readonly componentRegistry: ComponentRegistry;
    protected constructor(scopeType: ScopeType, componentRegistry: ComponentRegistry, parentScope: Scope);
    resolve<T extends object>(key: string): T;
    private findInstance(registration);
    private findScopedInstance(registration);
    private createInstance(registration);
}
export default BaseScope;
