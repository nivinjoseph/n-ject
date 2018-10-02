"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const lifestyle_1 = require("./lifestyle");
const n_exception_1 = require("@nivinjoseph/n-exception");
const component_registration_1 = require("./component-registration");
class ComponentRegistry {
    constructor() {
        this._registrations = new Array();
        this._registry = {};
    }
    register(key, component, lifestyle) {
        n_defensive_1.given(key, "key").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());
        n_defensive_1.given(component, "component").ensureHasValue();
        n_defensive_1.given(lifestyle, "lifestyle").ensureHasValue();
        key = key.trim();
        if (this._registry[key])
            throw new n_exception_1.ApplicationException("Duplicate registration for key '{0}'".format(key));
        let registration = new component_registration_1.ComponentRegistration(key, component, lifestyle);
        this._registrations.push(registration);
        this._registry[key] = registration;
    }
    verifyRegistrations() {
        for (let registration of this._registrations)
            this.walkDependencyGraph(registration);
    }
    find(key) {
        n_defensive_1.given(key, "key").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());
        key = key.trim();
        let result = this._registry[key];
        if (!result) {
            result = this._registrations.find(t => t.key === key);
            if (!result)
                console.log("COULD NOT FIND IN COMPONENT REGISTRY", key);
        }
        return result;
    }
    walkDependencyGraph(registration, visited = {}) {
        if (visited[registration.key])
            throw new n_exception_1.ApplicationException("Circular dependency detected with registration '{0}'.".format(registration.key));
        visited[registration.key] = registration;
        for (let dependency of registration.dependencies) {
            if (!this._registry[dependency])
                throw new n_exception_1.ApplicationException("Unregistered dependency '{0}' detected.".format(dependency));
            let dependencyRegistration = this._registry[dependency];
            if (registration.lifestyle === lifestyle_1.Lifestyle.Singleton && dependencyRegistration.lifestyle === lifestyle_1.Lifestyle.Scoped)
                throw new n_exception_1.ApplicationException("Singleton with a scoped dependency detected.");
            this.walkDependencyGraph(dependencyRegistration, visited);
        }
        visited[registration.key] = null;
    }
}
exports.ComponentRegistry = ComponentRegistry;
//# sourceMappingURL=component-registry.js.map