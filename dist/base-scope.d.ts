import { Scope } from "./scope";
import { ScopeType } from "./scope-type";
import "@nivinjoseph/n-ext";
import { ComponentRegistry } from "./component-registry";
export declare abstract class BaseScope implements Scope {
    private readonly _scopeType;
    private readonly _componentRegistry;
    private readonly _parentScope;
    private readonly _scopedInstanceRegistry;
    private _isBootstrapped;
    readonly scopeType: ScopeType;
    protected readonly componentRegistry: ComponentRegistry;
    protected readonly isBootstrapped: boolean;
    protected constructor(scopeType: ScopeType, componentRegistry: ComponentRegistry, parentScope: Scope);
    resolve<T extends object>(key: string): T;
    abstract createScope(): Scope;
    protected bootstrap(): void;
    private findInstance;
    private findScopedInstance;
    private createInstance;
}
