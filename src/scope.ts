import ScopeType from "./scope-type";

interface Scope
{
    scopeType: ScopeType;
    resolve(key: string): object;
    release(value: object): void;
}  

export default Scope;