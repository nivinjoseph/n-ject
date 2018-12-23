"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const base_scope_1 = require("./base-scope");
const component_registry_1 = require("./component-registry");
const scope_type_1 = require("./scope-type");
const lifestyle_1 = require("./lifestyle");
const child_scope_1 = require("./child-scope");
const n_exception_1 = require("@nivinjoseph/n-exception");
class Container extends base_scope_1.BaseScope {
    constructor() {
        super(scope_type_1.ScopeType.Root, new component_registry_1.ComponentRegistry(), null);
    }
    registerTransient(key, component, ...aliases) {
        this.register(key, component, lifestyle_1.Lifestyle.Transient, ...aliases);
        return this;
    }
    registerScoped(key, component, ...aliases) {
        this.register(key, component, lifestyle_1.Lifestyle.Scoped, ...aliases);
        return this;
    }
    registerSingleton(key, component, ...aliases) {
        this.register(key, component, lifestyle_1.Lifestyle.Singleton, ...aliases);
        return this;
    }
    registerInstance(key, instance, ...aliases) {
        this.register(key, instance, lifestyle_1.Lifestyle.Instance, ...aliases);
        return this;
    }
    install(componentInstaller) {
        if (this.isBootstrapped)
            throw new n_exception_1.InvalidOperationException("install after bootstrap");
        n_defensive_1.given(componentInstaller, "componentInstaller").ensureHasValue();
        componentInstaller.install(this);
        return this;
    }
    createScope() {
        if (!this.isBootstrapped)
            throw new n_exception_1.InvalidOperationException("createScope after bootstrap");
        return new child_scope_1.ChildScope(this.componentRegistry, this);
    }
    bootstrap() {
        if (this.isBootstrapped)
            throw new n_exception_1.InvalidOperationException("bootstrap after bootstrap");
        this.componentRegistry.verifyRegistrations();
        super.bootstrap();
    }
    register(key, component, lifestyle, ...aliases) {
        if (this.isBootstrapped)
            throw new n_exception_1.InvalidOperationException("register after bootstrap");
        n_defensive_1.given(key, "key").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());
        n_defensive_1.given(component, "component").ensureHasValue();
        n_defensive_1.given(lifestyle, "lifestyle").ensureHasValue().ensureIsNumber();
        n_defensive_1.given(aliases, "aliases").ensureHasValue().ensureIsArray()
            .ensure(t => t.every(u => u !== key), "alias cannot be the same as key")
            .ensure(t => t.length === t.distinct().length, "duplicates detected");
        this.componentRegistry.register(key, component, lifestyle, ...aliases);
    }
}
exports.Container = Container;
//# sourceMappingURL=container.js.map