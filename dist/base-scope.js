"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseScope = void 0;
const tslib_1 = require("tslib");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const scope_type_1 = require("./scope-type");
const lifestyle_1 = require("./lifestyle");
const n_exception_1 = require("@nivinjoseph/n-exception");
const component_registration_1 = require("./component-registration");
const reserved_keys_1 = require("./reserved-keys");
// internal
class BaseScope {
    constructor(scopeType, componentRegistry, parentScope) {
        // private readonly _scopedInstanceRegistry: {[index: string]: object} = {};
        this._scopedInstanceRegistry = new Map();
        this._isBootstrapped = false;
        this._isDisposed = false;
        this._disposePromise = null;
        (0, n_defensive_1.given)(scopeType, "scopeType").ensureHasValue().ensureIsEnum(scope_type_1.ScopeType);
        (0, n_defensive_1.given)(componentRegistry, "componentRegistry").ensureHasValue().ensureIsObject();
        (0, n_defensive_1.given)(parentScope, "parentScope").ensureIsObject()
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            .ensure(t => scopeType === scope_type_1.ScopeType.Child ? t != null : t == null, "cannot be null if scope is a child scope and has to be null if scope is root scope");
        // this._id = Uuid.create();
        this._scopeType = scopeType;
        this._componentRegistry = componentRegistry;
        this._parentScope = parentScope;
    }
    get componentRegistry() { return this._componentRegistry; }
    get isBootstrapped() { return this._isBootstrapped; }
    get isDisposed() { return this._isDisposed; }
    // public get id(): string { return this._id; }
    get scopeType() { return this._scopeType; }
    resolve(key) {
        if (this._isDisposed)
            throw new n_exception_1.ObjectDisposedException(this);
        (0, n_defensive_1.given)(this, "this").ensure(t => t.isBootstrapped, "not bootstrapped");
        (0, n_defensive_1.given)(key, "key").ensureHasValue().ensureIsString();
        key = key.trim();
        if (key === reserved_keys_1.ReservedKeys.serviceLocator)
            return this;
        const registration = this._componentRegistry.find(key);
        if (!registration)
            throw new n_exception_1.ApplicationException(`No component with key '${key}' registered.`);
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
                .forEachAsync((disposable) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                try {
                    yield disposable.promise;
                }
                catch (error) {
                    console.error(`Error: Failed to dispose component of type '${disposable.type}'.`);
                    console.error(error);
                }
            }));
        }
        return this._disposePromise;
    }
    bootstrap() {
        this._isBootstrapped = true;
    }
    _findInstance(registration) {
        (0, n_defensive_1.given)(registration, "registration").ensureHasValue().ensureIsType(component_registration_1.ComponentRegistration);
        if (registration.lifestyle === lifestyle_1.Lifestyle.Instance) {
            return registration.component;
        }
        else if (registration.lifestyle === lifestyle_1.Lifestyle.Singleton) {
            if (this.scopeType === scope_type_1.ScopeType.Child)
                return this._parentScope.resolve(registration.key);
            else
                return this._findScopedInstance(registration);
        }
        else if (registration.lifestyle === lifestyle_1.Lifestyle.Scoped) {
            if (this.scopeType === scope_type_1.ScopeType.Root)
                throw new n_exception_1.ApplicationException(`Cannot resolve component '${registration.key}' with scoped lifestyle from root scope.`);
            else
                return this._findScopedInstance(registration);
        }
        else {
            return this._createInstance(registration);
        }
    }
    _findScopedInstance(registration) {
        (0, n_defensive_1.given)(registration, "registration").ensureHasValue().ensureIsType(component_registration_1.ComponentRegistration);
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
        (0, n_defensive_1.given)(registration, "registration").ensureHasValue().ensureIsType(component_registration_1.ComponentRegistration);
        const dependencyInstances = [];
        for (const dependency of registration.dependencies) {
            if (dependency === reserved_keys_1.ReservedKeys.serviceLocator) {
                dependencyInstances.push(this);
                continue;
            }
            const dependencyRegistration = this._componentRegistry.find(dependency);
            if (!dependencyRegistration)
                throw new n_exception_1.ApplicationException(`Dependency '${dependency}' of component '${registration.key}' not registered.`);
            dependencyInstances.push(this._findInstance(dependencyRegistration));
        }
        return new registration.component(...dependencyInstances);
    }
}
exports.BaseScope = BaseScope;
//# sourceMappingURL=base-scope.js.map