import { given } from "@nivinjoseph/n-defensive";
import { InvalidOperationException, ObjectDisposedException } from "@nivinjoseph/n-exception";
import { BaseScope } from "./base-scope.js";
import { ChildScope } from "./child-scope.js";
import { ComponentRegistry } from "./component-registry.js";
import { Lifestyle } from "./lifestyle.js";
import { ReservedKeys } from "./reserved-keys.js";
import { ScopeType } from "./scope-type.js";
// public
export class Container extends BaseScope {
    _myDisposePromise = null;
    constructor() {
        super(ScopeType.Root, new ComponentRegistry(), null);
    }
    registerTransient(key, component, ...aliases) {
        this._register(key, component, Lifestyle.Transient, ...aliases);
        return this;
    }
    registerScoped(key, component, ...aliases) {
        this._register(key, component, Lifestyle.Scoped, ...aliases);
        return this;
    }
    registerSingleton(key, component, ...aliases) {
        this._register(key, component, Lifestyle.Singleton, ...aliases);
        return this;
    }
    registerInstance(key, instance, ...aliases) {
        this._register(key, instance, Lifestyle.Instance, ...aliases);
        return this;
    }
    install(componentInstaller) {
        if (this.isDisposed)
            throw new ObjectDisposedException(this);
        if (this.isBootstrapped)
            throw new InvalidOperationException("install after bootstrap");
        given(componentInstaller, "componentInstaller").ensureHasValue();
        componentInstaller.install(this);
        return this;
    }
    createScope() {
        if (this.isDisposed)
            throw new ObjectDisposedException(this);
        if (!this.isBootstrapped)
            throw new InvalidOperationException("createScope after bootstrap");
        return new ChildScope(this.componentRegistry, this);
    }
    bootstrap() {
        if (this.isDisposed)
            throw new ObjectDisposedException(this);
        if (this.isBootstrapped)
            throw new InvalidOperationException("bootstrap after bootstrap");
        this.componentRegistry.verifyRegistrations();
        super.bootstrap();
    }
    dispose() {
        if (this._myDisposePromise == null)
            this._myDisposePromise = super.dispose().then(() => this.componentRegistry.dispose());
        return this._myDisposePromise;
    }
    deregister(key) {
        if (this.isDisposed)
            throw new ObjectDisposedException(this);
        if (this.isBootstrapped)
            throw new InvalidOperationException("register after bootstrap");
        given(key, "key").ensureHasValue();
        this.componentRegistry.deregister(key);
    }
    _register(key, component, lifestyle, ...aliases) {
        if (this.isDisposed)
            throw new ObjectDisposedException(this);
        if (this.isBootstrapped)
            throw new InvalidOperationException("register after bootstrap");
        given(key, "key").ensureHasValue().ensureIsString()
            .ensure(t => !ReservedKeys.all.contains(t.trim()), "cannot use reserved key");
        given(component, "component").ensureHasValue();
        given(lifestyle, "lifestyle").ensureHasValue().ensureIsNumber();
        given(aliases, "aliases").ensureHasValue().ensureIsArray()
            .ensure(t => t.every(u => u !== key), "alias cannot be the same as key")
            .ensure(t => t.length === t.distinct().length, "duplicates detected");
        this.componentRegistry.register(key, component, lifestyle, ...aliases);
    }
}
//# sourceMappingURL=container.js.map