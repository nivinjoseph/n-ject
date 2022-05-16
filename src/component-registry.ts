import { given } from "@nivinjoseph/n-defensive";
import { Lifestyle } from "./lifestyle";
import { ApplicationException, ObjectDisposedException } from "@nivinjoseph/n-exception";
import { ComponentRegistration } from "./component-registration";
import { ReservedKeys } from "./reserved-keys";
import { Disposable } from "@nivinjoseph/n-util";

// internal
export class ComponentRegistry implements Disposable
{
    private readonly _registrations = new Array<ComponentRegistration>();
    // private readonly _registry: { [index: string]: ComponentRegistration } = {};
    private readonly _registry = new Map<string, ComponentRegistration>();
    private _isDisposed = false;


    public register(key: string, component: Function | object, lifestyle: Lifestyle, ...aliases: string[]): void
    {
        if (this._isDisposed)
            throw new ObjectDisposedException(this);
        
        given(key, "key").ensureHasValue();
        given(component, "component").ensureHasValue();
        given(lifestyle, "lifestyle").ensureHasValue().ensureIsNumber();
        given(aliases, "aliases").ensureHasValue().ensureIsArray()
            .ensure(t => t.every(u => u !== key), "alias cannot be the same as key")
            .ensure(t => t.length === t.distinct().length, "duplicates detected");

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

        given(key, "key").ensureHasValue();
        
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
        
        for (let registration of this._registrations)
            this.walkDependencyGraph(registration);
    }

    public find(key: string): ComponentRegistration | null
    {
        if (this._isDisposed)
            throw new ObjectDisposedException(this);
        
        given(key, "key").ensureHasValue();

        key = key.trim();
        return this._registry.get(key);
        
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
    
    public async dispose(): Promise<void>
    {
        if (this._isDisposed)
            return;
        
        this._isDisposed = true;
        
        await Promise.all(this._registrations.map(t => t.dispose()));
    }
    

    private walkDependencyGraph(registration: ComponentRegistration, visited: {[index: string]: ComponentRegistration} = {}): void
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
            
            const dependencyRegistration = this._registry.get(dependency);
            
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
            
            this.walkDependencyGraph(dependencyRegistration, visited);
        }

        visited[registration.key] = null;
        registration.aliases.forEach(t => visited[t] = null);
    }
}