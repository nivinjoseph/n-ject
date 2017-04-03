import { Registry } from "./registry";
export interface ComponentInstaller {
    install(registry: Registry): void;
}
