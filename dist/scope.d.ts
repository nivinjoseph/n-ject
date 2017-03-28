import ScopeType from "./scope-type";
interface Scope {
    scopeType: ScopeType;
    resolve<T extends object>(key: string): T;
}
export default Scope;
