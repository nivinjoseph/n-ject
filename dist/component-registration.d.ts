import { Lifestyle } from "./lifestyle.js";
import "reflect-metadata";
export declare class ComponentRegistration {
    private readonly _key;
    private readonly _component;
    private readonly _lifestyle;
    private readonly _dependencies;
    private readonly _aliases;
    readonly key: string;
    readonly component: Function;
    readonly lifestyle: Lifestyle;
    readonly dependencies: ReadonlyArray<string>;
    readonly aliases: ReadonlyArray<string>;
    constructor(key: string, component: Function, lifestyle: Lifestyle, ...aliases: string[]);
    private getDependencies;
}
