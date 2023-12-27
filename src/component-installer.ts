import { Registry } from "./registry.js";

// public
export interface ComponentInstaller
{
    install(registry: Registry): void;
}