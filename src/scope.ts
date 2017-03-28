import ScopeType from "./scope-type";

// public
interface Scope
{
    scopeType: ScopeType;
    resolve<T extends object>(key: string): T;
}  

export default Scope;