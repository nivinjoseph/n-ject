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
    private _isDisposed;
    get scopeType(): ScopeType;
    protected get componentRegistry(): ComponentRegistry;
    protected get isBootstrapped(): boolean;
    protected get isDisposed(): boolean;
    protected constructor(scopeType: ScopeType, componentRegistry: ComponentRegistry, parentScope: Scope);
    resolve<T extends object>(key: string): T;
    dispose(): Promise<void>;
    abstract createScope(): Scope;
    protected bootstrap(): void;
    private findInstance;
    private findScopedInstance;
    private createInstance;
}
