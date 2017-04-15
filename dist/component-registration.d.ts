import { Lifestyle } from "./lifestyle.js";
import "reflect-metadata";
export declare class ComponentRegistration {
    private readonly _key;
    private readonly _component;
    private readonly _lifestyle;
    private readonly _dependencies;
    readonly key: string;
    readonly component: Function;
    readonly lifestyle: Lifestyle;
    readonly dependencies: Array<string>;
    constructor(key: string, component: Function, lifestyle: Lifestyle);
    private getDependencies();
}
