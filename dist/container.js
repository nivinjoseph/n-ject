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
var child_scope_1 = require("./child-scope");
var n_exception_1 = require("n-exception");
// public
var Container = (function (_super) {
    __extends(Container, _super);
    function Container() {
        return _super.call(this, scope_type_1.default.Root, new component_registry_1.default(), null) || this;
    }
    Container.prototype.register = function (key, component, lifestyle) {
        if (this.isBootstrapped)
            throw new n_exception_1.InvalidOperationException("register");
        n_defensive_1.default(key, "key").ensureHasValue().ensure(function (t) { return !t.isEmptyOrWhiteSpace(); });
        n_defensive_1.default(component, "component").ensureHasValue().ensure(function (t) { return typeof t === "function"; });
        n_defensive_1.default(lifestyle, "lifestyle").ensureHasValue();
        this.componentRegistry.register(key, component, lifestyle);
        return this;
    };
    Container.prototype.install = function (componentInstaller) {
        if (this.isBootstrapped)
            throw new n_exception_1.InvalidOperationException("install");
        n_defensive_1.default(componentInstaller, "componentInstaller").ensureHasValue();
        componentInstaller.install(this);
        return this;
    };
    Container.prototype.createScope = function () {
        if (!this.isBootstrapped)
            throw new n_exception_1.InvalidOperationException("createScope");
        return new child_scope_1.default(this.componentRegistry, this);
    };
    Container.prototype.bootstrap = function () {
        if (this.isBootstrapped)
            throw new n_exception_1.InvalidOperationException("bootstrap");
        this.componentRegistry.verifyRegistrations();
        _super.prototype.bootstrap.call(this);
    };
    return Container;
}(base_scope_1.default));
exports.default = Container;
//# sourceMappingURL=container.js.map