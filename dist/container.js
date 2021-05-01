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
exports.Container = void 0;
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
        if (this.isDisposed)
            throw new n_exception_1.ObjectDisposedException(this);
        // if (this.isBootstrapped)
        //     throw new InvalidOperationException("install after bootstrap");    
        n_defensive_1.given(componentInstaller, "componentInstaller").ensureHasValue();
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
        // if (this.isBootstrapped)
        //     throw new InvalidOperationException("bootstrap after bootstrap");
        this.componentRegistry.verifyRegistrations();
        super.bootstrap();
    }
    dispose() {
        const _super = Object.create(null, {
            dispose: { get: () => super.dispose }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isDisposed)
                return;
            yield _super.dispose.call(this);
            yield this.componentRegistry.dispose();
        });
    }
    register(key, component, lifestyle, ...aliases) {
        if (this.isDisposed)
            throw new n_exception_1.ObjectDisposedException(this);
        // if (this.isBootstrapped)
        //     throw new InvalidOperationException("register after bootstrap");
        n_defensive_1.given(key, "key").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace())
            .ensure(t => !reserved_keys_1.ReservedKeys.all.contains(t.trim()), "cannot use reserved key");
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