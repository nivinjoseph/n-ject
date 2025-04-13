import { given } from "@nivinjoseph/n-defensive";
import { InvalidOperationException, ObjectDisposedException } from "@nivinjoseph/n-exception";
import { BaseScope } from "./base-scope.js";
import { ChildScope } from "./child-scope.js";
import { ComponentInstaller } from "./component-installer.js";
import { ComponentRegistry } from "./component-registry.js";
import { Lifestyle } from "./lifestyle.js";
import { Registry } from "./registry.js";
import { ReservedKeys } from "./reserved-keys.js";
import { Scope } from "./scope.js";
import { ScopeType } from "./scope-type.js";

/**
 * The main IoC container class that manages component registration and scope creation.
 * This is the entry point for using the dependency injection framework.
 */
export class Container extends BaseScope implements Registry
{
    private _myDisposePromise: Promise<void> | null = null;

    /**
     * Creates a new instance of the Container.
     */
    public constructor()
    {
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
    public registerTransient(key: string, component: Function, ...aliases: Array<string>): Registry
    {
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
    public registerScoped(key: string, component: Function, ...aliases: Array<string>): Registry
    {
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
    public registerSingleton(key: string, component: Function, ...aliases: Array<string>): Registry
    {
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
    public registerInstance(key: string, instance: object, ...aliases: Array<string>): Registry
    {
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
    public install(componentInstaller: ComponentInstaller): Container
    {
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
    public createScope(): Scope
    {
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
    public override bootstrap(): void
    {
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
    public override dispose(): Promise<void>
    {
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
    public deregister(key: string): void
    {
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
    private _register(key: string, component: Function | object, lifestyle: Lifestyle, ...aliases: Array<string>): void
    {
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