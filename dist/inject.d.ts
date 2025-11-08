import { ClassDefinition } from "@nivinjoseph/n-util";
export declare const injectionsKey: unique symbol;
/**
 * Decorator that marks a class for dependency injection.
 * Specifies the dependencies that should be injected into the class constructor.
 *
 * @param dependencies - The keys of the dependencies to inject
 * @returns A class decorator that marks the class for dependency injection
 *
 * @example
 * ```typescript
 * @inject("userService", "logger")
 * class UserController
 * {
 *     private readonly _userService: UserService;
 *     private readonly _logger: Logger;
 *
 *     constructor(userService: UserService, logger: Logger)
 *     {
 *         given(userService, "userService").ensureHasValue().ensureIsObject();
 *         given(logger, "logger").ensureHasValue().ensureIsObject();
 *
 *         this._userService = userService;
 *         this._logger = logger;
 *     }
 * }
 * ```
 */
export declare function inject<This extends ClassDefinition<any>>(...dependencies: [string, ...Array<string>]): InjectClassDecorator<This>;
export type InjectClassDecorator<This extends ClassDefinition<any>> = (value: This, context: ClassDecoratorContext<This>) => void;
//# sourceMappingURL=inject.d.ts.map