import "reflect-metadata";
export declare const injectSymbol: unique symbol;
export declare function inject(...dependencies: Array<string>): Function;
