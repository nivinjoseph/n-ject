"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var n_defensive_1 = require("n-defensive");
var base_scope_1 = require("./base-scope");
var component_registry_1 = require("./component-registry");
var scope_type_1 = require("./scope-type");
var lifestyle_1 = require("./lifestyle");
var child_scope_1 = require("./child-scope");
var n_exception_1 = require("n-exception");
// public
var Container = (function (_super) {
    __extends(Container, _super);
    function Container() {
        return _super.call(this, scope_type_1.ScopeType.Root, new component_registry_1.ComponentRegistry(), null) || this;
    }
    Container.prototype.registerTransient = function (key, component) {
        return this.register(key, component, lifestyle_1.Lifestyle.Transient);
    };
    Container.prototype.registerScoped = function (key, component) {
        return this.register(key, component, lifestyle_1.Lifestyle.Scoped);
    };
    Container.prototype.registerSingleton = function (key, component) {
        return this.register(key, component, lifestyle_1.Lifestyle.Singleton);
    };
    Container.prototype.install = function (componentInstaller) {
        if (this.isBootstrapped)
            throw new n_exception_1.InvalidOperationException("install after bootstrap");
        n_defensive_1.given(componentInstaller, "componentInstaller").ensureHasValue();
        componentInstaller.install(this);
        return this;
    };
    Container.prototype.createScope = function () {
        if (!this.isBootstrapped)
            throw new n_exception_1.InvalidOperationException("createScope after bootstrap");
        return new child_scope_1.ChildScope(this.componentRegistry, this);
    };
    Container.prototype.bootstrap = function () {
        if (this.isBootstrapped)
            throw new n_exception_1.InvalidOperationException("bootstrap after bootstrap");
        this.componentRegistry.verifyRegistrations();
        _super.prototype.bootstrap.call(this);
    };
    Container.prototype.register = function (key, component, lifestyle) {
        if (this.isBootstrapped)
            throw new n_exception_1.InvalidOperationException("register after bootstrap");
        n_defensive_1.given(key, "key").ensureHasValue().ensure(function (t) { return !t.isEmptyOrWhiteSpace(); });
        n_defensive_1.given(component, "component").ensureHasValue().ensure(function (t) { return typeof t === "function"; });
        n_defensive_1.given(lifestyle, "lifestyle").ensureHasValue();
        this.componentRegistry.register(key, component, lifestyle);
        return this;
    };
    return Container;
}(base_scope_1.BaseScope));
exports.Container = Container;
//# sourceMappingURL=container.js.map