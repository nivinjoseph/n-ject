import { given } from "@nivinjoseph/n-defensive";
import { ApplicationException, ObjectDisposedException } from "@nivinjoseph/n-exception";
import { ComponentRegistration } from "./component-registration.js";
import { Lifestyle } from "./lifestyle.js";
import { ReservedKeys } from "./reserved-keys.js";
import { ScopeType } from "./scope-type.js";
// internal
export class BaseScope {
    // private readonly _id: string;
    _scopeType;
    _componentRegistry;
    _parentScope;
    // private readonly _scopedInstanceRegistry: {[index: string]: object} = {};
    _scopedInstanceRegistry = new Map();
    _isBootstrapped = false;
    _isDisposed = false;
    _disposePromise = null;
    get componentRegistry() { return this._componentRegistry; }
    get isBootstrapped() { return this._isBootstrapped; }
    get isDisposed() { return this._isDisposed; }
    // public get id(): string { return this._id; }
    get scopeType() { return this._scopeType; }
    constructor(scopeType, componentRegistry, parentScope) {
        given(scopeType, "scopeType").ensureHasValue().ensureIsEnum(ScopeType);
        given(componentRegistry, "componentRegistry").ensureHasValue().ensureIsObject();
        given(parentScope, "parentScope").ensureIsObject()
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            .ensure(t => scopeType === ScopeType.Child ? t != null : t == null, "cannot be null if scope is a child scope and has to be null if scope is root scope");
        // this._id = Uuid.create();
        this._scopeType = scopeType;
        this._componentRegistry = componentRegistry;
        this._parentScope = parentScope;
    }
    resolve(key) {
        if (this._isDisposed)
            throw new ObjectDisposedException(this);
        given(this, "this").ensure(t => t.isBootstrapped, "not bootstrapped");
        given(key, "key").ensureHasValue().ensureIsString();
        key = key.trim();
        if (key === ReservedKeys.serviceLocator)
            return this;
        const registration = this._componentRegistry.find(key);
        if (!registration)
            throw new ApplicationException(`No component with key '${key}' registered.`);
        return this._findInstance(registration);
    }
    dispose() {
        if (!this._isDisposed) {
            this._isDisposed = true;
            this._disposePromise = [...this._scopedInstanceRegistry.keys()]
                .map(t => this._scopedInstanceRegistry.get(t))
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                .filter(t => !!t.dispose && typeof t.dispose === "function")
                .map(t => ({ type: t.getTypeName(), promise: t.dispose() }))
                .forEachAsync(async (disposable) => {
                try {
                    await disposable.promise;
                }
                catch (error) {
                    console.error(`Error: Failed to dispose component of type '${disposable.type}'.`);
                    console.error(error);
                }
            });
        }
        return this._disposePromise;
    }
    bootstrap() {
        this._isBootstrapped = true;
    }
    _findInstance(registration) {
        given(registration, "registration").ensureHasValue().ensureIsType(ComponentRegistration);
        if (registration.lifestyle === Lifestyle.Instance) {
            return registration.component;
        }
        else if (registration.lifestyle === Lifestyle.Singleton) {
            if (this.scopeType === ScopeType.Child)
                return this._parentScope.resolve(registration.key);
            else
                return this._findScopedInstance(registration);
        }
        else if (registration.lifestyle === Lifestyle.Scoped) {
            if (this.scopeType === ScopeType.Root)
                throw new ApplicationException(`Cannot resolve component '${registration.key}' with scoped lifestyle from root scope.`);
            else
                return this._findScopedInstance(registration);
        }
        else {
            return this._createInstance(registration);
        }
    }
    _findScopedInstance(registration) {
        given(registration, "registration").ensureHasValue().ensureIsType(ComponentRegistration);
        let instance = this._scopedInstanceRegistry.get(registration.key);
        if (instance == null) {
            instance = this._createInstance(registration);
            this._scopedInstanceRegistry.set(registration.key, instance);
            registration.aliases.forEach(t => this._scopedInstanceRegistry.set(t, instance));
        }
        return instance;
        // if (this._scopedInstanceRegistry[registration.key])
        //     return this._scopedInstanceRegistry[registration.key];
        // else
        // {
        //     const instance = this.createInstance(registration);
        //     this._scopedInstanceRegistry[registration.key] = instance;
        //     registration.aliases.forEach(t => this._scopedInstanceRegistry[t] = instance);
        //     return instance;
        // }
    }
    _createInstance(registration) {
        given(registration, "registration").ensureHasValue().ensureIsType(ComponentRegistration);
        const dependencyInstances = [];
        for (const dependency of registration.dependencies) {
            if (dependency === ReservedKeys.serviceLocator) {
                dependencyInstances.push(this);
                continue;
            }
            const dependencyRegistration = this._componentRegistry.find(dependency);
            if (!dependencyRegistration)
                throw new ApplicationException(`Dependency '${dependency}' of component '${registration.key}' not registered.`);
            dependencyInstances.push(this._findInstance(dependencyRegistration));
        }
        return new registration.component(...dependencyInstances);
    }
}
//# sourceMappingURL=base-scope.js.map