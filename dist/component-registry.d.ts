import Lifestyle from "./lifestyle";
import ComponentRegistration from "./component-registration";
export default class ComponentRegistry {
    private readonly _registrations;
    private readonly _registry;
    register(key: string, component: Function, lifestyle: Lifestyle): void;
    verifyRegistrations(): void;
    find(key: string): ComponentRegistration;
    private walkDependencyGraph(registration, visited?);
}
