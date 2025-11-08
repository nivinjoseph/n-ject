import { given } from "@nivinjoseph/n-defensive";
import { ApplicationException, ObjectDisposedException } from "@nivinjoseph/n-exception";
import { Disposable } from "@nivinjoseph/n-util";
import { ComponentRegistration } from "./component-registration.js";
import { Lifestyle } from "./lifestyle.js";
import { ReservedKeys } from "./reserved-keys.js";

// internal
export class ComponentRegistry implements Disposable
{
    private readonly _registrations = new Array<ComponentRegistration>();
    // private readonly _registry: { [index: string]: ComponentRegistration } = {};
    private readonly _registry = new Map<string, ComponentRegistration>();
    private _isDisposed = false;
    private _disposePromise: Promise<void> | null = null;


    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    public register(key: string, component: Function | object, lifestyle: Lifestyle, ...aliases: Array<string>): void
    {
        if (this._isDisposed)
            throw new ObjectDisposedException(this);
        
        given(key, "key").ensureHasValue().ensureIsString();
        given(component, "component").ensureHasValue();
        given(lifestyle, "lifestyle").ensureHasValue().ensureIsEnum(Lifestyle);
        given(aliases, "aliases").ensureHasValue().ensureIsArray()
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            .ensure(t => t.every(u => u != null), "alias cannot null")
            .ensure(t => t.every(u => u !== key), "alias cannot be the same as key")
            .ensure(t => t.length === t.map(u => u.trim()).distinct().length, "duplicates detected");

        key = key.trim();
        if (this._registry.has(key))
            throw new ApplicationException(`Duplicate registration for key '${key}'`);
        
        aliases.forEach(t =>
        {
            const alias = t.trim();
            if (this._registry.has(alias))
                throw new ApplicationException(`Duplicate registration for alias '${alias}'`);
        });

        const registration = new ComponentRegistration(key, component, lifestyle, ...aliases);
        this._registrations.push(registration);
        this._registry.set(registration.key, registration);
        registration.aliases.forEach(t => this._registry.set(t, registration));
    }
    
    public deregister(key: string): void
    {
        if (this._isDisposed)
            throw new ObjectDisposedException(this);

        given(key, "key").ensureHasValue().ensureIsString();
        
        key = key.trim();
        if (!this._registry.has(key))
            return;
        
        const registration = this._registrations.find(t => t.key === key)!;
        this._registrations.remove(registration);
        this._registry.delete(registration.key);
        registration.aliases.forEach(t => this._registry.delete(t));
    }

    public verifyRegistrations(): void
    {
        if (this._isDisposed)
            throw new ObjectDisposedException(this);
        
        for (const registration of this._registrations)
            this._walkDependencyGraph(registration);
    }

    public find(key: string): ComponentRegistration | null
    {
        if (this._isDisposed)
            throw new ObjectDisposedException(this);
        
        given(key, "key").ensureHasValue().ensureIsString();

        key = key.trim();
        return this._registry.get(key) ?? null;
        
        // FIXME: do we still need the code below
        // let result = this._registry[key];
        // if (!result)
        // {
        //     result = this._registrations.find(t => t.key === key || t.aliases.some(u => u === key));
        //     if (!result)
        //         console.log("COULD NOT FIND IN COMPONENT REGISTRY", key);
        // }
        
        // return result;
    }
    
    public dispose(): Promise<void>
    {
        if (!this._isDisposed)
        {
            this._isDisposed = true;
            this._disposePromise = Promise.all(this._registrations.map(t => t.dispose())) as unknown as Promise<void>;
        }
        
        return this._disposePromise!;
    }
    

    private _walkDependencyGraph(registration: ComponentRegistration, visited: Record<string, ComponentRegistration | null | undefined> = {}): void
    {
        // check if current is in visited
        // add current to visited
        // check if the dependencies are registered
        // walk the dependencies reusing the visited
        // remove current from visited

        if (visited[registration.key] || registration.aliases.some(t => !!visited[t]))
            throw new ApplicationException(`Circular dependency detected with registration '${registration.key}'.`);

        visited[registration.key] = registration;
        registration.aliases.forEach(t => visited[t] = registration);

        for (const dependency of registration.dependencies)
        {
            if (dependency === ReservedKeys.serviceLocator)
                continue;
            
            if (!this._registry.has(dependency))
                throw new ApplicationException(`Unregistered dependency '${dependency}' detected.`);
            
            const dependencyRegistration = this._registry.get(dependency)!;
            
            // rules
            // singleton --> singleton ==> good (child & root)
            // singleton --> scoped =====> bad
            // singleton --> transient ==> good (child & root)
            // scoped -----> singleton ==> good (child only)
            // scoped -----> scoped =====> good (child only)
            // scoped -----> transient ==> good (child only)
            // transient --> singleton ==> good (child & root)
            // transient --> scoped =====> good (child only)
            // transient --> transient ==> good (child & root)
            
            if (registration.lifestyle === Lifestyle.Singleton && dependencyRegistration.lifestyle === Lifestyle.Scoped)
                throw new ApplicationException("Singleton with a scoped dependency detected.");    
            
            this._walkDependencyGraph(dependencyRegistration, visited);
        }

        visited[registration.key] = null;
        registration.aliases.forEach(t => visited[t] = null);
    }
}