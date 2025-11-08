/**
 * Interface for component registration management.
 * Provides methods to register components with different lifestyles.
 *
 * @example
 * ```typescript
 * class MyInstaller implements ComponentInstaller
 * {
 *     public install(registry: Registry): void
 *     {
 *         registry
 *             .registerScoped("serviceC", ServiceC)
 *             .registerInstance("config", new Config());
 *     }
 * }
 * ```
 */
export interface Registry {
    /**
     * Registers a component with transient Lifestyle.
     * Creates a new instance each time the component is resolved.
     * @param key - The unique identifier for the component
     * @param component - The component class or function to register
     * @param aliases - Optional aliases for the component
     * @returns The registry instance for method chaining
     */
    registerTransient(key: string, component: Function, ...aliases: Array<string>): Registry;
    /**
     * Registers a component with scoped Lifestyle.
     * Creates one instance per scope.
     * @param key - The unique identifier for the component
     * @param component - The component class or function to register
     * @param aliases - Optional aliases for the component
     * @returns The registry instance for method chaining
     */
    registerScoped(key: string, component: Function, ...aliases: Array<string>): Registry;
    /**
     * Registers a component with singleton Lifestyle.
     * Creates one instance for the entire container.
     * @param key - The unique identifier for the component
     * @param component - The component class or function to register
     * @param aliases - Optional aliases for the component
     * @returns The registry instance for method chaining
     */
    registerSingleton(key: string, component: Function, ...aliases: Array<string>): Registry;
    /**
     * Registers a pre-created instance.
     * Uses the provided instance for all resolutions.
     * @param key - The unique identifier for the component
     * @param instance - The pre-created instance to register
     * @param aliases - Optional aliases for the component
     * @returns The registry instance for method chaining
     */
    registerInstance(key: string, instance: any, ...aliases: Array<string>): Registry;
}
//# sourceMappingURL=registry.d.ts.map