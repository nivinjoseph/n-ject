import { ScopeType } from "./scope-type";

// public
export interface Scope
{
    scopeType: ScopeType;
    resolve<T extends object>(key: string): T;
    createScope(): Scope;
}