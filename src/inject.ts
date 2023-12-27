import { given } from "@nivinjoseph/n-defensive";
import { ClassDefinition } from "@nivinjoseph/n-util";

//@ts-expect-error polyfill to use metadata object
Symbol.metadata ??= Symbol("Symbol.metadata");

export const injectionsKey = Symbol.for("@nivinjoseph/n-ject/inject");

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


type InjectClassDecorator<This extends ClassDefinition<any>> = (
    value: This,
    context: ClassDecoratorContext<This>
) => void;
