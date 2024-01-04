import { Disposable } from "@nivinjoseph/n-util";
import { ComponentRegistration } from "./component-registration.js";
import { Lifestyle } from "./lifestyle.js";
export declare class ComponentRegistry implements Disposable {
    private readonly _registrations;
    private readonly _registry;
    private _isDisposed;
    private _disposePromise;
    register(key: string, component: Function | object, lifestyle: Lifestyle, ...aliases: Array<string>): void;
    deregister(key: string): void;
    verifyRegistrations(): void;
    find(key: string): ComponentRegistration | null;
    dispose(): Promise<void>;
    private _walkDependencyGraph;
}
//# sourceMappingURL=component-registry.d.ts.map