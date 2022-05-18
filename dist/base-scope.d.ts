import { Scope } from "./scope";
import { ScopeType } from "./scope-type";
import { ComponentRegistry } from "./component-registry";
export declare abstract class BaseScope implements Scope {
    private readonly _scopeType;
    private readonly _componentRegistry;
    private readonly _parentScope;
    private readonly _scopedInstanceRegistry;
    private _isBootstrapped;
    private _isDisposed;
    protected get componentRegistry(): ComponentRegistry;
    protected get isBootstrapped(): boolean;
    protected get isDisposed(): boolean;
    get scopeType(): ScopeType;
    protected constructor(scopeType: ScopeType, componentRegistry: ComponentRegistry, parentScope: Scope | null);
    resolve<T extends object>(key: string): T;
    dispose(): Promise<void>;
    abstract createScope(): Scope;
    protected bootstrap(): void;
    private _findInstance;
    private _findScopedInstance;
    private _createInstance;
}
