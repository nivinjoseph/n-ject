"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var n_defensive_1 = require("n-defensive");
var lifestyle_1 = require("./lifestyle");
var n_exception_1 = require("n-exception");
var component_registration_1 = require("./component-registration");
// internal
var ComponentRegistry = (function () {
    function ComponentRegistry() {
        this._registrations = new Array();
        this._registry = {};
    }
    ComponentRegistry.prototype.register = function (key, component, lifestyle) {
        n_defensive_1.given(key, "key").ensureHasValue().ensure(function (t) { return !t.isEmptyOrWhiteSpace(); });
        n_defensive_1.given(component, "component").ensureHasValue().ensure(function (t) { return typeof t === "function"; });
        n_defensive_1.given(lifestyle, "lifestyle").ensureHasValue();
        key = key.trim();
        if (this._registry[key])
            throw new n_exception_1.ApplicationException("Duplicate registration for key '{0}'".format(key));
        var registration = new component_registration_1.ComponentRegistration(key, component, lifestyle);
        this._registrations.push(registration);
        this._registry[key] = registration;
    };
    ComponentRegistry.prototype.verifyRegistrations = function () {
        for (var _i = 0, _a = this._registrations; _i < _a.length; _i++) {
            var registration = _a[_i];
            this.walkDependencyGraph(registration);
        }
    };
    ComponentRegistry.prototype.find = function (key) {
        n_defensive_1.given(key, "key").ensureHasValue().ensure(function (t) { return !t.isEmptyOrWhiteSpace(); });
        key = key.trim();
        return this._registry[key];
    };
    ComponentRegistry.prototype.walkDependencyGraph = function (registration, visited) {
        // check if current is in visited
        // add current to visited
        // check if the dependencies are registered
        // walk the dependencies reusing the visited
        // remove current from visited
        if (visited === void 0) { visited = {}; }
        if (visited[registration.key])
            throw new n_exception_1.ApplicationException("Circular dependency detected with registration '{0}'.".format(registration.key));
        visited[registration.key] = registration;
        for (var _i = 0, _a = registration.dependencies; _i < _a.length; _i++) {
            var dependency = _a[_i];
            if (!this._registry[dependency])
                throw new n_exception_1.ApplicationException("Unregistered dependency '{0}' detected.".format(dependency));
            var dependencyRegistration = this._registry[dependency];
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
            if (registration.lifestyle === lifestyle_1.Lifestyle.Singleton && dependencyRegistration.lifestyle === lifestyle_1.Lifestyle.Scoped)
                throw new n_exception_1.ApplicationException("Singleton with a scoped dependency detected.");
            this.walkDependencyGraph(dependencyRegistration, visited);
        }
        visited[registration.key] = null;
    };
    return ComponentRegistry;
}());
exports.ComponentRegistry = ComponentRegistry;
//# sourceMappingURL=component-registry.js.map