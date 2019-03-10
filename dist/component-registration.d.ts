import { Lifestyle } from "./lifestyle.js";
import "reflect-metadata";
import { Disposable } from "@nivinjoseph/n-util";
export declare class ComponentRegistration implements Disposable {
    private readonly _key;
    private readonly _component;
    private readonly _lifestyle;
    private readonly _dependencies;
    private readonly _aliases;
    private _isDisposed;
    readonly key: string;
    readonly component: Function | object;
    readonly lifestyle: Lifestyle;
    readonly dependencies: ReadonlyArray<string>;
    readonly aliases: ReadonlyArray<string>;
    constructor(key: string, component: Function | object, lifestyle: Lifestyle, ...aliases: string[]);
    dispose(): Promise<void>;
    private getDependencies;
}
