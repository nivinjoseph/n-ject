import "reflect-metadata";

export const injectSymbol = Symbol("inject"); 

// public
export function inject(...dependencies: string[]): Function
{
    return (target: Function) => Reflect.defineMetadata(injectSymbol, dependencies, target);
}