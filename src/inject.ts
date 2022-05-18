import "reflect-metadata";

export const injectSymbol = Symbol.for("@nivinjoseph/n-ject/inject"); 

// public
export function inject(...dependencies: Array<string>): Function
{
    return (target: Function) => Reflect.defineMetadata(injectSymbol, dependencies, target);
}