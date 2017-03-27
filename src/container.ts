import given from "n-defensive";
import Scope from "./scope";
import ScopeType from "./scope-type";
import Lifestyle from "./lifestyle";

export default class Container implements Scope
{
    private readonly _scopeType = ScopeType.Root;
    private readonly _registrations = new Array<Registration>();


    public get scopeType(): ScopeType { return this._scopeType; }


    public register(key: string, component: Function, lifestyle: Lifestyle): Container
    {

    }

    public createScope(): Scope
    {

    }

    public resolve(key: string): object
    {
        throw new Error('Method not implemented.');
    }

    public release(value: object): void
    {
        throw new Error('Method not implemented.');
    }
}

class Registration
{
    
}

class ChildScope implements Scope
{
    private readonly _scopeType = ScopeType.Child;
    private readonly _rootScope: Scope;


    public get scopeType(): ScopeType { return this._scopeType; }


    public constructor(rootScope: Scope)
    {
        given(rootScope, "rootScope").ensureHasValue();
        this._rootScope = rootScope;
    }


    resolve(key: string): object
    {
        throw new Error('Method not implemented.');
    }
    release(value: object): void
    {
        throw new Error('Method not implemented.');
    }
}    