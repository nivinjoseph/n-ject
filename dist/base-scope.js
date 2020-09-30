"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseScope = void 0;
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const scope_type_1 = require("./scope-type");
const lifestyle_1 = require("./lifestyle");
require("@nivinjoseph/n-ext");
const n_exception_1 = require("@nivinjoseph/n-exception");
const reserved_keys_1 = require("./reserved-keys");
class BaseScope {
    constructor(scopeType, componentRegistry, parentScope) {
        this._scopedInstanceRegistry = {};
        this._isBootstrapped = false;
        this._isDisposed = false;
        n_defensive_1.given(scopeType, "scopeType").ensureHasValue();
        n_defensive_1.given(componentRegistry, "componentRegistry").ensureHasValue();
        n_defensive_1.given(parentScope, "parentScope")
            .ensure(t => scopeType === scope_type_1.ScopeType.Child ? t != null : t == null, "cannot be null if scope is a child scope and has to be null if scope is root scope");
        this._scopeType = scopeType;
        this._componentRegistry = componentRegistry;
        this._parentScope = parentScope;
    }
    get scopeType() { return this._scopeType; }
    get componentRegistry() { return this._componentRegistry; }
    get isBootstrapped() { return this._isBootstrapped; }
    get isDisposed() { return this._isDisposed; }
    resolve(key) {
        if (this._isDisposed)
            throw new n_exception_1.ObjectDisposedException(this);
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
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isDisposed)
                return;
            this._isDisposed = true;
            let disposables;
            try {
                disposables = Object.keys(this._scopedInstanceRegistry)
                    .map(t => this._scopedInstanceRegistry[t])
                    .filter(t => !!t.dispose)
                    .map(t => ({ type: t.getTypeName(), promise: t.dispose() }));
            }
            catch (error) {
                console.error(`Error: Failed to dispose one or more scoped components.`);
                console.error(error);
                return;
            }
            for (const disposable of disposables) {
                try {
                    yield disposable.promise;
                }
                catch (error) {
                    console.error(`Error: Failed to dispose component of type '${disposable.type}'.`);
                    console.error(error);
                }
            }
        });
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
            const instance = this.createInstance(registration);
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