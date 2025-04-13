# @nivinjoseph/n-ject

A powerful and flexible Inversion of Control (IoC) container for TypeScript/JavaScript applications.

## Features

- Dependency Injection (DI) container with TypeScript support
- Configurable component Lifestyle (scoping)
- Easy-to-use decorator-based injection
- Hierarchical scoping system
- Type-safe dependency resolution
- Flexible component registration
- Circular dependency detection
- Service Locator pattern support for dynamic dependency resolution
- Multiple injection strategies (constructor and service locator)

## Installation

```bash
# Using npm
npm install @nivinjoseph/n-ject

# Using yarn
yarn add @nivinjoseph/n-ject
```

## Requirements

- Node.js >= 20.10
- TypeScript >= 5.3 (for TypeScript projects)

## Basic Usage

```typescript
import { Container, inject } from "@nivinjoseph/n-ject";

// Define your service
class UserService 
{
    public getUser(id: string): Promise<any> 
    {
        return Promise.resolve({ id, name: "John Doe" });
    }
}

// Define a component that depends on UserService
@inject("userService")
class UserController 
{
    private readonly _userService: UserService;
    
    
    constructor(userService: UserService) 
    {
        given(userService, "userService").ensureHasValue().ensureIsObject();
        this._userService = userService;
    }
    
    public async getUser(id: string): Promise<any> 
    {
        return await this._userService.getUser(id);
    }
}

// Create and configure the container
const container = new Container();

// Register components
container
    .register("userService", UserService)
    .register("userController", UserController);

// Create a scope and resolve dependencies
const scope = container.createScope();
const userController = scope.resolve<UserController>("userController");
```

## Component Registration

Components can be registered with different lifestyles:

```typescript
container
    .registerTransient("transientService", TransientService)
    .registerScoped("scopedService", ScopedService)
    .registerSingleton("singletonService", SingletonService)
    .registerInstance("instanceService", new InstanceService());
```

You can also register aliases for the same component:

```typescript
container
    .registerSingleton("userService", UserService, "userRepository", "userManager")
    .registerScoped("orderService", OrderService, "orderProcessor", "orderHandler");
```

The available lifestyles are:

- `Transient`: Creates a new instance each time the component is resolved
- `Scoped`: Creates one instance per scope
- `Singleton`: Creates one instance for the entire container
- `Instance`: Uses a pre-created instance

## Component Installer

Component installers provide a way to organize and group related component registrations. They are useful for:

- Grouping related components together
- Conditional registration based on configuration
- Modularizing your application's component registration

### Basic Installer Example

```typescript
// Define your installer
class UserComponentsInstaller implements ComponentInstaller
{
    public install(registry: Registry): void
    {
        registry
            .registerSingleton("userService", UserService)
            .registerScoped("userRepository", UserRepository)
            .registerTransient("userValidator", UserValidator);
    }
}

// Use the installer
const container = new Container();
container.install(new UserComponentsInstaller());
container.bootstrap();

// Components are now available for resolution
const userService = container.resolve<UserService>("userService");
```

## Dependency Injection

Use the `@inject` decorator to specify dependencies:

```typescript
@inject("dependency1", "dependency2")
class MyComponent 
{
    private readonly _dep1: Dependency1;
    private readonly _dep2: Dependency2;
    
    
    constructor(dep1: Dependency1, dep2: Dependency2) 
    {
        given(dep1, "dep1").ensureHasValue().ensureIsObject();
        this._dep1 = dep1;
        
        given(dep2, "dep2").ensureHasValue().ensureIsObject();
        this._dep2 = dep2;
    }
}
```

## Scoping

The framework supports scoping for component resolution:

```typescript
const scope = container.createScope();

// Components resolved from the scope respect their configured Lifestyle
const service = scope.resolve<MyService>("myService");

// Don't forget to dispose the scope when done
await scope.dispose();
```

## Service Locator Pattern

In addition to constructor-based injection, the framework supports Service Locator pattern for more flexible dependency resolution.

### Service Locator Injection

```typescript
import { ServiceLocator, inject } from "@nivinjoseph/n-ject";

@inject("ServiceLocator")
class MyService
{
    private readonly _serviceLocator: ServiceLocator;
    
    
    constructor(serviceLocator: ServiceLocator)
    {
        given(serviceLocator, "serviceLocator").ensureHasValue().ensureIsObject();
        this._serviceLocator = serviceLocator;
    }
    
    public async doSomething(): Promise<void>
    {
        // Resolve dependencies on demand
        const logger = this._serviceLocator.resolve<Logger>("logger");
        const config = this._serviceLocator.resolve<Config>("config");
        
        // Use the resolved dependencies
        await logger.log("Doing something");
        const value = config.get("someKey");
    }
}

// Register the service
container.registerSingleton("myService", MyService);
```

### Creating Scopes from Service Locator

```typescript
class RequestHandler
{
    private readonly _serviceLocator: ServiceLocator;
    
    
    constructor(serviceLocator: ServiceLocator)
    {
        given(serviceLocator, "serviceLocator").ensureHasValue().ensureIsObject();
        this._serviceLocator = serviceLocator;
    }
    
    public async handleRequest(): Promise<void>
    {
        // Create a new scope for this request
        const scope = this._serviceLocator.createScope();
        
        try
        {
            // Resolve scoped services
            const userService = scope.resolve<UserService>("userService");
            const transactionService = scope.resolve<TransactionService>("transactionService");
            
            // Use the services
            await userService.process();
            await transactionService.commit();
        }
        finally
        {
            // Always dispose the scope when done
            await scope.dispose();
        }
    }
}

// Register the handler
container.registerSingleton("requestHandler", RequestHandler);
```

### Benefits of Service Locator Pattern

- **Lazy Resolution**: Dependencies are resolved only when needed
- **Dynamic Resolution**: Can resolve different implementations based on runtime conditions
- **Flexible Scoping**: Can create and manage scopes programmatically
- **Runtime Configuration**: Can change resolution behavior at runtime

### When to Use Service Locator

- When dependencies are optional or conditional
- When you need to create scopes dynamically
- When you need runtime flexibility in dependency resolution

## API Reference

### Container

The main IoC container class that manages component registration and scope creation.

Methods:
- `registerTransient(key: string, component: Function, ...aliases: Array<string>)`: Registers a component with transient Lifestyle
- `registerScoped(key: string, component: Function, ...aliases: Array<string>)`: Registers a component with scoped Lifestyle
- `registerSingleton(key: string, component: Function, ...aliases: Array<string>)`: Registers a component with singleton Lifestyle
- `registerInstance(key: string, instance: object, ...aliases: Array<string>)`: Registers a pre-created instance
- `createScope()`: Creates a new scope
- `hasRegistration(key: string)`: Checks if a component is registered
- `deregister(key: string)`: Removes a component registration
- `install(componentInstaller: ComponentInstaller)`: Installs components using an installer
- `bootstrap()`: Bootstraps the container
- `dispose()`: Disposes the container and its resources

### Scope

Represents a dependency resolution scope.

Methods:
- `resolve<T>(key: string)`: Resolves a component
- `dispose()`: Disposes the scope and its resources

### Decorators

- `@inject(...dependencies)`: Specifies component dependencies

### Lifestyle

- `Singleton`: One instance per container
- `Scoped`: One instance per scope
- `Transient`: New instance per resolution
- `Instance`: Uses a pre-created instance

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Dependencies

Core dependencies:
- @nivinjoseph/n-defensive
- @nivinjoseph/n-exception
- @nivinjoseph/n-ext
- @nivinjoseph/n-util

## Support

For issues and feature requests, please use the [GitHub issue tracker](https://github.com/nivinjoseph/n-ject/issues).
