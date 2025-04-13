import { given } from "@nivinjoseph/n-defensive";
import { ClassDefinition } from "@nivinjoseph/n-util";

//@ts-expect-error polyfill to use metadata object
Symbol.metadata ??= Symbol("Symbol.metadata");

export const injectionsKey = Symbol.for("@nivinjoseph/n-ject/inject");

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
export function inject<This extends ClassDefinition<any>>(...dependencies: [string, ...Array<string>]): InjectClassDecorator<This>
{
    const decorator: InjectClassDecorator<This> = (_, context) =>
    {
        given(context, "context")
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            .ensure(t => t.kind === "class", "inject should only be used on classes");

        context.metadata[injectionsKey] = dependencies;
    };

    return decorator;
}


export type InjectClassDecorator<This extends ClassDefinition<any>> = (
    value: This,
    context: ClassDecoratorContext<This>
) => void;
