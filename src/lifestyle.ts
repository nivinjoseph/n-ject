/**
 * Defines the lifecycle of a component in the dependency injection container.
 * The lifecycle determines how instances of a component are created and managed.
 */
export enum Lifestyle
{
    /**
     * Creates a new instance each time the component is resolved.
     * Each request for the component gets a fresh instance.
     */
    Transient = 0,

    /**
     * Creates one instance per scope.
     * The same instance is reused within a scope, but different scopes get different instances.
     */
    Scoped = 1,

    /**
     * Creates one instance for the entire container.
     * The same instance is reused across all scopes.
     */
    Singleton = 2,

    /**
     * Uses a pre-created instance.
     * The provided instance is used for all resolutions.
     */
    Instance = 3
}