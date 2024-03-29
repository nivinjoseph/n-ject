import { Disposable } from "@nivinjoseph/n-util";
import { Lifestyle } from "./lifestyle.js";
export declare class ComponentRegistration implements Disposable {
    private readonly _key;
    private readonly _component;
    private readonly _lifestyle;
    private readonly _dependencies;
    private readonly _aliases;
    private _isDisposed;
    private _disposePromise;
    get key(): string;
    get component(): Function | object;
    get lifestyle(): Lifestyle;
    get dependencies(): ReadonlyArray<string>;
    get aliases(): ReadonlyArray<string>;
    constructor(key: string, component: Function | object, lifestyle: Lifestyle, ...aliases: Array<string>);
    dispose(): Promise<void>;
    private _disposeComponent;
    private _getDependencies;
}
//# sourceMappingURL=component-registration.d.ts.map