import { Lifestyle } from "./lifestyle";
import { ComponentRegistration } from "./component-registration";
import { Disposable } from "@nivinjoseph/n-util";
export declare class ComponentRegistry implements Disposable {
    private readonly _registrations;
    private readonly _registry;
    private _isDisposed;
    register(key: string, component: Function | object, lifestyle: Lifestyle, ...aliases: string[]): void;
    verifyRegistrations(): void;
    find(key: string): ComponentRegistration | null;
    dispose(): Promise<void>;
    private walkDependencyGraph;
}
