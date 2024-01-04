import { given } from "@nivinjoseph/n-defensive";
//@ts-expect-error polyfill to use metadata object
Symbol.metadata ??= Symbol("Symbol.metadata");
export const injectionsKey = Symbol.for("@nivinjoseph/n-ject/inject");
export function inject(...dependencies) {
    const decorator = (_, context) => {
        given(context, "context")
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            .ensure(t => t.kind === "class", "inject should only be used on classes");
        context.metadata[injectionsKey] = dependencies;
    };
    return decorator;
}
//# sourceMappingURL=inject.js.map