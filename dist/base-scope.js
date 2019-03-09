"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const scope_type_1 = require("./scope-type");
const lifestyle_1 = require("./lifestyle");
require("@nivinjoseph/n-ext");
const n_exception_1 = require("@nivinjoseph/n-exception");
const n_util_1 = require("@nivinjoseph/n-util");
const reserved_keys_1 = require("./reserved-keys");
class BaseScope {
    constructor(scopeType, componentRegistry, parentScope) {
        this._scopedInstanceRegistry = {};
        this._isBootstrapped = false;
        n_defensive_1.given(scopeType, "scopeType").ensureHasValue();
        n_defensive_1.given(componentRegistry, "componentRegistry").ensureHasValue();
        n_defensive_1.given(parentScope, "parentScope")
            .ensure(t => scopeType === scope_type_1.ScopeType.Child ? parentScope != null : parentScope == null, "cannot be null if scope is a child scope and has to be null if scope is root scope");
        this._id = n_util_1.Uuid.create();
        this._scopeType = scopeType;
        this._componentRegistry = componentRegistry;
        this._parentScope = parentScope;
    }
    get id() { return this._id; }
    get scopeType() { return this._scopeType; }
    get componentRegistry() { return this._componentRegistry; }
    get isBootstrapped() { return this._isBootstrapped; }
    resolve(key) {
        if (!this.isBootstrapped)
            throw new n_exception_1.InvalidOperationException("resolve");
        n_defensive_1.given(key, "key").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());
        key = key.trim();
        if (key === reserved_keys_1.ReservedKeys.serviceLocator)
            return this;
        let registration = this._componentRegistry.find(key);
        if (!registration)
            throw new n_exception_1.ApplicationException("No component with key '{0}' registered.".format(key));
        return this.findInstance(registration);
    }
    bootstrap() {
        this._isBootstrapped = true;
    }
    findInstance(registration) {
        if (registration.lifestyle === lifestyle_1.Lifestyle.Instance) {
            return registration.component;
        }
        else if (registration.lifestyle === lifestyle_1.Lifestyle.Singleton) {
            if (this.scopeType === scope_type_1.ScopeType.Child)
                return this._parentScope.resolve(registration.key);
            else
                return this.findScopedInstance(registration);
        }
        else if (registration.lifestyle === lifestyle_1.Lifestyle.Scoped) {
            if (this.scopeType === scope_type_1.ScopeType.Root)
                throw new n_exception_1.ApplicationException("Cannot resolve component '{0}' with scoped lifestyle from root scope."
                    .format(registration.key));
            else
                return this.findScopedInstance(registration);
        }
        else {
            return this.createInstance(registration);
        }
    }
    findScopedInstance(registration) {
        if (this._scopedInstanceRegistry[registration.key])
            return this._scopedInstanceRegistry[registration.key];
        else {
            let instance = this.createInstance(registration);
            this._scopedInstanceRegistry[registration.key] = instance;
            registration.aliases.forEach(t => this._scopedInstanceRegistry[t] = instance);
            return instance;
        }
    }
    createInstance(registration) {
        const dependencyInstances = [];
        for (const dependency of registration.dependencies) {
            if (dependency === reserved_keys_1.ReservedKeys.serviceLocator) {
                dependencyInstances.push(this);
                continue;
            }
            const dependencyRegistration = this._componentRegistry.find(dependency);
            if (!dependencyRegistration)
                throw new n_exception_1.ApplicationException("Dependency '{0}' of component '{1}' not registered."
                    .format(dependency, registration.key));
            dependencyInstances.push(this.findInstance(dependencyRegistration));
        }
        return new registration.component(...dependencyInstances);
    }
}
exports.BaseScope = BaseScope;
//# sourceMappingURL=base-scope.js.map