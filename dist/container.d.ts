import { BaseScope } from "./base-scope.js";
import { ComponentInstaller } from "./component-installer.js";
import { Registry } from "./registry.js";
import { Scope } from "./scope.js";
/**
 * The main IoC container class that manages component registration and scope creation.
 * This is the entry point for using the dependency injection framework.
 */
export declare class Container extends BaseScope implements Registry {
    private _myDisposePromise;
    /**
     * Creates a new instance of the Container.
     */
    constructor();
    /**
     * Registers a component with transient lifecycle.
     * Creates a new instance each time the component is resolved.
     * @param key - The unique identifier for the component
     * @param component - The component class or function to register
     * @param aliases - Optional aliases for the component
     * @returns The container instance for method chaining
     */
    registerTransient(key: string, component: Function, ...aliases: Array<string>): Registry;
    /**
     * Registers a component with scoped lifecycle.
     * Creates one instance per scope.
     * @param key - The unique identifier for the component
     * @param component - The component class or function to register
     * @param aliases - Optional aliases for the component
     * @returns The container instance for method chaining
     */
    registerScoped(key: string, component: Function, ...aliases: Array<string>): Registry;
    /**
     * Registers a component with singleton lifecycle.
     * Creates one instance for the entire container.
     * @param key - The unique identifier for the component
     * @param component - The component class or function to register
     * @param aliases - Optional aliases for the component
     * @returns The container instance for method chaining
     */
    registerSingleton(key: string, component: Function, ...aliases: Array<string>): Registry;
    /**
     * Registers a pre-created instance.
     * Uses the provided instance for all resolutions.
     * @param key - The unique identifier for the component
     * @param instance - The pre-created instance to register
     * @param aliases - Optional aliases for the component
     * @returns The container instance for method chaining
     */
    registerInstance(key: string, instance: object, ...aliases: Array<string>): Registry;
    /**
     * Installs components using an installer.
     * @param componentInstaller - The installer to use
     * @returns The container instance for method chaining
     * @throws ObjectDisposedException if the container is disposed
     * @throws InvalidOperationException if the container is bootstrapped
     */
    install(componentInstaller: ComponentInstaller): Container;
    /**
     * Creates a new scope for dependency resolution.
     * @returns A new scope instance
     * @throws ObjectDisposedException if the container is disposed
     * @throws InvalidOperationException if the container is not bootstrapped
     */
    createScope(): Scope;
    /**
     * Bootstraps the container.
     * Verifies all registrations and prepares the container for use.
     * @throws ObjectDisposedException if the container is disposed
     * @throws InvalidOperationException if the container is already bootstrapped
     */
    bootstrap(): void;
    /**
     * Disposes the container and its resources.
     * Cleans up all scopes and releases resources.
     * @returns A promise that resolves when disposal is complete
     */
    dispose(): Promise<void>;
    /**
     * Removes a component registration.
     * @param key - The component key to deregister
     * @throws ObjectDisposedException if the container is disposed
     * @throws InvalidOperationException if the container is bootstrapped
     */
    deregister(key: string): void;
    /**
     * Internal method to register a component with the specified lifecycle.
     * @param key - The unique identifier for the component
     * @param component - The component class, function, or instance to register
     * @param lifestyle - The lifecycle to use for the component
     * @param aliases - Optional aliases for the component
     * @throws ObjectDisposedException if the container is disposed
     * @throws InvalidOperationException if the container is bootstrapped
     */
    private _register;
}
//# sourceMappingURL=container.d.ts.map