"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const tslib_1 = require("tslib");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const base_scope_1 = require("./base-scope");
const component_registry_1 = require("./component-registry");
const scope_type_1 = require("./scope-type");
const lifestyle_1 = require("./lifestyle");
const child_scope_1 = require("./child-scope");
const n_exception_1 = require("@nivinjoseph/n-exception");
const reserved_keys_1 = require("./reserved-keys");
// public
class Container extends base_scope_1.BaseScope {
    constructor() {
        super(scope_type_1.ScopeType.Root, new component_registry_1.ComponentRegistry(), null);
    }
    registerTransient(key, component, ...aliases) {
        this._register(key, component, lifestyle_1.Lifestyle.Transient, ...aliases);
        return this;
    }
    registerScoped(key, component, ...aliases) {
        this._register(key, component, lifestyle_1.Lifestyle.Scoped, ...aliases);
        return this;
    }
    registerSingleton(key, component, ...aliases) {
        this._register(key, component, lifestyle_1.Lifestyle.Singleton, ...aliases);
        return this;
    }
    registerInstance(key, instance, ...aliases) {
        this._register(key, instance, lifestyle_1.Lifestyle.Instance, ...aliases);
        return this;
    }
    install(componentInstaller) {
        if (this.isDisposed)
            throw new n_exception_1.ObjectDisposedException(this);
        if (this.isBootstrapped)
            throw new n_exception_1.InvalidOperationException("install after bootstrap");
        (0, n_defensive_1.given)(componentInstaller, "componentInstaller").ensureHasValue();
        componentInstaller.install(this);
        return this;
    }
    createScope() {
        if (this.isDisposed)
            throw new n_exception_1.ObjectDisposedException(this);
        if (!this.isBootstrapped)
            throw new n_exception_1.InvalidOperationException("createScope after bootstrap");
        return new child_scope_1.ChildScope(this.componentRegistry, this);
    }
    bootstrap() {
        if (this.isDisposed)
            throw new n_exception_1.ObjectDisposedException(this);
        if (this.isBootstrapped)
            throw new n_exception_1.InvalidOperationException("bootstrap after bootstrap");
        this.componentRegistry.verifyRegistrations();
        super.bootstrap();
    }
    dispose() {
        const _super = Object.create(null, {
            dispose: { get: () => super.dispose }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.isDisposed)
                return;
            yield _super.dispose.call(this);
            yield this.componentRegistry.dispose();
        });
    }
    deregister(key) {
        if (this.isDisposed)
            throw new n_exception_1.ObjectDisposedException(this);
        if (this.isBootstrapped)
            throw new n_exception_1.InvalidOperationException("register after bootstrap");
        (0, n_defensive_1.given)(key, "key").ensureHasValue();
        this.componentRegistry.deregister(key);
    }
    _register(key, component, lifestyle, ...aliases) {
        if (this.isDisposed)
            throw new n_exception_1.ObjectDisposedException(this);
        if (this.isBootstrapped)
            throw new n_exception_1.InvalidOperationException("register after bootstrap");
        (0, n_defensive_1.given)(key, "key").ensureHasValue().ensureIsString()
            .ensure(t => !reserved_keys_1.ReservedKeys.all.contains(t.trim()), "cannot use reserved key");
        (0, n_defensive_1.given)(component, "component").ensureHasValue();
        (0, n_defensive_1.given)(lifestyle, "lifestyle").ensureHasValue().ensureIsNumber();
        (0, n_defensive_1.given)(aliases, "aliases").ensureHasValue().ensureIsArray()
            .ensure(t => t.every(u => u !== key), "alias cannot be the same as key")
            .ensure(t => t.length === t.distinct().length, "duplicates detected");
        this.componentRegistry.register(key, component, lifestyle, ...aliases);
    }
}
exports.Container = Container;
//# sourceMappingURL=container.js.map