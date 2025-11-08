import { given } from "@nivinjoseph/n-defensive";
import { InvalidOperationException, ObjectDisposedException } from "@nivinjoseph/n-exception";
import { BaseScope } from "./base-scope.js";
import { ChildScope } from "./child-scope.js";
import { ComponentRegistry } from "./component-registry.js";
import { Lifestyle } from "./lifestyle.js";
import { ReservedKeys } from "./reserved-keys.js";
import { ScopeType } from "./scope-type.js";
/**
 * The main IoC container class that manages component registration and scope creation.
 * This is the entry point for using the dependency injection framework.
 */
export class Container extends BaseScope {
    _myDisposePromise = null;
    /**
     * Creates a new instance of the Container.
     */
    constructor() {
        super(ScopeType.Root, new ComponentRegistry(), null);
    }
    /**
     * Registers a component with transient lifecycle.
     * Creates a new instance each time the component is resolved.
     * @param key - The unique identifier for the component
     * @param component - The component class or function to register
     * @param aliases - Optional aliases for the component
     * @returns The container instance for method chaining
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    registerTransient(key, component, ...aliases) {
        this._register(key, component, Lifestyle.Transient, ...aliases);
        return this;
    }
    /**
     * Registers a component with scoped lifecycle.
     * Creates one instance per scope.
     * @param key - The unique identifier for the component
     * @param component - The component class or function to register
     * @param aliases - Optional aliases for the component
     * @returns The container instance for method chaining
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    registerScoped(key, component, ...aliases) {
        this._register(key, component, Lifestyle.Scoped, ...aliases);
        return this;
    }
    /**
     * Registers a component with singleton lifecycle.
     * Creates one instance for the entire container.
     * @param key - The unique identifier for the component
     * @param component - The component class or function to register
     * @param aliases - Optional aliases for the component
     * @returns The container instance for method chaining
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    registerSingleton(key, component, ...aliases) {
        this._register(key, component, Lifestyle.Singleton, ...aliases);
        return this;
    }
    /**
     * Registers a pre-created instance.
     * Uses the provided instance for all resolutions.
     * @param key - The unique identifier for the component
     * @param instance - The pre-created instance to register
     * @param aliases - Optional aliases for the component
     * @returns The container instance for method chaining
     */
    registerInstance(key, instance, ...aliases) {
        this._register(key, instance, Lifestyle.Instance, ...aliases);
        return this;
    }
    /**
     * Installs components using an installer.
     * @param componentInstaller - The installer to use
     * @returns The container instance for method chaining
     * @throws ObjectDisposedException if the container is disposed
     * @throws InvalidOperationException if the container is bootstrapped
     */
    install(componentInstaller) {
        if (this.isDisposed)
            throw new ObjectDisposedException(this);
        if (this.isBootstrapped)
            throw new InvalidOperationException("install after bootstrap");
        given(componentInstaller, "componentInstaller").ensureHasValue();
        componentInstaller.install(this);
        return this;
    }
    /**
     * Creates a new scope for dependency resolution.
     * @returns A new scope instance
     * @throws ObjectDisposedException if the container is disposed
     * @throws InvalidOperationException if the container is not bootstrapped
     */
    createScope() {
        if (this.isDisposed)
            throw new ObjectDisposedException(this);
        if (!this.isBootstrapped)
            throw new InvalidOperationException("createScope after bootstrap");
        return new ChildScope(this.componentRegistry, this);
    }
    /**
     * Bootstraps the container.
     * Verifies all registrations and prepares the container for use.
     * @throws ObjectDisposedException if the container is disposed
     * @throws InvalidOperationException if the container is already bootstrapped
     */
    bootstrap() {
        if (this.isDisposed)
            throw new ObjectDisposedException(this);
        if (this.isBootstrapped)
            throw new InvalidOperationException("bootstrap after bootstrap");
        this.componentRegistry.verifyRegistrations();
        super.bootstrap();
    }
    /**
     * Disposes the container and its resources.
     * Cleans up all scopes and releases resources.
     * @returns A promise that resolves when disposal is complete
     */
    dispose() {
        if (this._myDisposePromise == null)
            this._myDisposePromise = super.dispose().then(() => this.componentRegistry.dispose());
        return this._myDisposePromise;
    }
    /**
     * Removes a component registration.
     * @param key - The component key to deregister
     * @throws ObjectDisposedException if the container is disposed
     * @throws InvalidOperationException if the container is bootstrapped
     */
    deregister(key) {
        if (this.isDisposed)
            throw new ObjectDisposedException(this);
        if (this.isBootstrapped)
            throw new InvalidOperationException("register after bootstrap");
        given(key, "key").ensureHasValue();
        this.componentRegistry.deregister(key);
    }
    /**
     * Internal method to register a component with the specified lifecycle.
     * @param key - The unique identifier for the component
     * @param component - The component class, function, or instance to register
     * @param lifestyle - The lifecycle to use for the component
     * @param aliases - Optional aliases for the component
     * @throws ObjectDisposedException if the container is disposed
     * @throws InvalidOperationException if the container is bootstrapped
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
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