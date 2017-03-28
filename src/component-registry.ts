import given from "n-defensive";
import Lifestyle from "./lifestyle";
import { ApplicationException } from "n-exception";
import ComponentRegistration from "./component-registration";

// internal
export default class ComponentRegistry
{
    private readonly _registrations = new Array<ComponentRegistration>();
    private readonly _registry = {};


    public register(key: string, component: Function, lifestyle: Lifestyle): void
    {
        given(key, "key").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());
        given(component, "component").ensureHasValue().ensure(t => typeof t === "function");
        given(lifestyle, "lifestyle").ensureHasValue();

        key = key.trim();
        if (this._registry[key])
            throw new ApplicationException("Duplicate registration for key '{0}'".format(key));

        let registration = new ComponentRegistration(key, component, lifestyle);
        this._registrations.push(registration);
        this._registry[key] = registration;
    }

    public verifyRegistrations(): void
    {
        for (let registration of this._registrations)
            this.walkDependencyGraph(registration);
    }

    public find(key: string): ComponentRegistration
    {
        given(key, "key").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());

        key = key.trim();
        return this._registry[key];
    }

    private walkDependencyGraph(registration: ComponentRegistration, visited: object = {}): void
    {
        // check if current is in visited
        // add current to visited
        // check if the dependencies are registered
        // walk the dependencies reusing the visited
        // remove current from visited

        if (visited[registration.key])
            throw new ApplicationException("Circular dependency detected with registration '{0}'.".format(registration.key));

        visited[registration.key] = registration;

        for (let dependency of registration.dependencies)
        {
            if (!this._registry[dependency])
                throw new ApplicationException("Unregistered dependency '{0}' detected.".format(dependency));

            this.walkDependencyGraph(this._registry[dependency], visited);
        }

        visited[registration.key] = null;
    }
}