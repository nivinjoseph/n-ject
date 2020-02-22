import { given } from "@nivinjoseph/n-defensive";
import { Lifestyle } from "./lifestyle";
import { ApplicationException, ObjectDisposedException } from "@nivinjoseph/n-exception";
import { ComponentRegistration } from "./component-registration";
import { ReservedKeys } from "./reserved-keys";
import { Disposable } from "./disposable";

// internal
export class ComponentRegistry implements Disposable
{
    private readonly _registrations = new Array<ComponentRegistration>();
    private readonly _registry: { [index: string]: ComponentRegistration } = {};
    private _isDisposed = false;


    public register(key: string, component: Function | object, lifestyle: Lifestyle, ...aliases: string[]): void
    {
        if (this._isDisposed)
            throw new ObjectDisposedException(this);
        
        given(key, "key").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());
        given(component, "component").ensureHasValue();
        given(lifestyle, "lifestyle").ensureHasValue().ensureIsNumber();
        given(aliases, "aliases").ensureHasValue().ensureIsArray()
            .ensure(t => t.every(u => u !== key), "alias cannot be the same as key")
            .ensure(t => t.length === t.distinct().length, "duplicates detected");

        key = key.trim();
        if (this._registry[key])
            throw new ApplicationException("Duplicate registration for key '{0}'".format(key));
        
        aliases.forEach(t =>
        {
            const alias = t.trim();
            if (this._registry[alias])
                throw new ApplicationException("Duplicate registration for alias '{0}'".format(alias));
        });

        let registration = new ComponentRegistration(key, component, lifestyle, ...aliases);
        this._registrations.push(registration);
        this._registry[registration.key] = registration;
        registration.aliases.forEach(t => this._registry[t] = registration);
    }

    public verifyRegistrations(): void
    {
        if (this._isDisposed)
            throw new ObjectDisposedException(this);
        
        for (let registration of this._registrations)
            this.walkDependencyGraph(registration);
    }

    public find(key: string): ComponentRegistration
    {
        if (this._isDisposed)
            throw new ObjectDisposedException(this);
        
        given(key, "key").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());

        key = key.trim();
        let result = this._registry[key];
        if (!result)
        {
            result = this._registrations.find(t => t.key === key || t.aliases.some(u => u === key));
            if (!result)
                console.log("COULD NOT FIND IN COMPONENT REGISTRY", key);    
        }  
        
        return result;
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
            throw new ApplicationException("Circular dependency detected with registration '{0}'.".format(registration.key));

        visited[registration.key] = registration;
        registration.aliases.forEach(t => visited[t] = registration);

        for (let dependency of registration.dependencies)
        {
            if (dependency === ReservedKeys.serviceLocator)
                continue;
            
            if (!this._registry[dependency])
                throw new ApplicationException("Unregistered dependency '{0}' detected.".format(dependency));
            
            let dependencyRegistration = this._registry[dependency] as ComponentRegistration;
            
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