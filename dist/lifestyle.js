/**
 * Defines the lifecycle of a component in the dependency injection container.
 * The lifecycle determines how instances of a component are created and managed.
 */
export var Lifestyle;
(function (Lifestyle) {
    /**
     * Creates a new instance each time the component is resolved.
     * Each request for the component gets a fresh instance.
     */
    Lifestyle[Lifestyle["Transient"] = 0] = "Transient";
    /**
     * Creates one instance per scope.
     * The same instance is reused within a scope, but different scopes get different instances.
     */
    Lifestyle[Lifestyle["Scoped"] = 1] = "Scoped";
    /**
     * Creates one instance for the entire container.
     * The same instance is reused across all scopes.
     */
    Lifestyle[Lifestyle["Singleton"] = 2] = "Singleton";
    /**
     * Uses a pre-created instance.
     * The provided instance is used for all resolutions.
     */
    Lifestyle[Lifestyle["Instance"] = 3] = "Instance";
})(Lifestyle || (Lifestyle = {}));
//# sourceMappingURL=lifestyle.js.map