"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var n_defensive_1 = require("n-defensive");
var scope_type_1 = require("./scope-type");
var lifestyle_1 = require("./lifestyle");
require("n-ext");
var n_exception_1 = require("n-exception");
// internal
var BaseScope = (function () {
    function BaseScope(scopeType, componentRegistry, parentScope) {
        this._scopedInstanceRegistry = {};
        this._isBootstrapped = false;
        n_defensive_1.default(scopeType, "scopeType").ensureHasValue();
        n_defensive_1.default(componentRegistry, "componentRegistry").ensureHasValue();
        n_defensive_1.default(parentScope, "parentScope")
            .ensure(function (t) { return scopeType === scope_type_1.default.Child ? parentScope != null : parentScope == null; }, "cannot be null if scope is a child scope and has to be null if scope is root scope");
        this._scopeType = scopeType;
        this._componentRegistry = componentRegistry;
        this._parentScope = parentScope;
    }
    Object.defineProperty(BaseScope.prototype, "scopeType", {
        get: function () { return this._scopeType; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseScope.prototype, "componentRegistry", {
        get: function () { return this._componentRegistry; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseScope.prototype, "isBootstrapped", {
        get: function () { return this._isBootstrapped; },
        enumerable: true,
        configurable: true
    });
    BaseScope.prototype.resolve = function (key) {
        if (!this.isBootstrapped)
            throw new n_exception_1.InvalidOperationException("resolve");
        n_defensive_1.default(key, "key").ensureHasValue().ensure(function (t) { return !t.isEmptyOrWhiteSpace(); });
        key = key.trim();
        var registration = this._componentRegistry.find(key);
        if (!registration)
            throw new n_exception_1.ApplicationException("No component with key '{0}' registered.".format(key));
        return this.findInstance(registration);
    };
    BaseScope.prototype.bootstrap = function () {
        this._isBootstrapped = true;
    };
    BaseScope.prototype.findInstance = function (registration) {
        if (registration.lifestyle === lifestyle_1.default.Singleton) {
            if (this.scopeType === scope_type_1.default.Child)
                return this._parentScope.resolve(registration.key);
            else
                return this.findScopedInstance(registration);
        }
        else if (registration.lifestyle === lifestyle_1.default.Scoped) {
            if (this.scopeType === scope_type_1.default.Root)
                throw new n_exception_1.ApplicationException("Cannot resolve component '{0}' with scoped lifestyle from root scope."
                    .format(registration.key));
            else
                return this.findScopedInstance(registration);
        }
        else {
            return this.createInstance(registration);
        }
    };
    BaseScope.prototype.findScopedInstance = function (registration) {
        if (this._scopedInstanceRegistry[registration.key])
            return this._scopedInstanceRegistry[registration.key];
        else {
            var instance = this.createInstance(registration);
            this._scopedInstanceRegistry[registration.key] = instance;
            return instance;
        }
    };
    BaseScope.prototype.createInstance = function (registration) {
        var dependencyInstances = [];
        for (var _i = 0, _a = registration.dependencies; _i < _a.length; _i++) {
            var dependency = _a[_i];
            var dependencyRegistration = this._componentRegistry.find(dependency);
            if (!dependencyRegistration)
                throw new n_exception_1.ApplicationException("Dependency '{0}' of component '{1}' not registered."
                    .format(dependency, registration.key));
            dependencyInstances.push(this.findInstance(dependencyRegistration));
        }
        return new ((_b = registration.component).bind.apply(_b, [void 0].concat(dependencyInstances)))();
        var _b;
    };
    return BaseScope;
}());
exports.default = BaseScope;
//# sourceMappingURL=base-scope.js.map